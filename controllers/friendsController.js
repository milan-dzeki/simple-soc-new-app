const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const findMutualFriends = require("../utils/findMutualFriends");
const Friends = require("../models/friendsModel");
const Settings = require("../models/settingsModel");
const User = require("../models/userModel");
const ActivityLog = require("../models/activityLogModel");
const Notification = require("../models/notificationModel");

exports.sendFriendRequest = catchAsync(async(req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if(!user || (user && user.active === false)) return next(new AppError("Cannot find user you are trying to add. Maybe he has blocked you or has deactivated account", 404));

  const amIBlocked = user.blockList.find(u => u.toString() === req.user._id.toString());
  if(amIBlocked) return next(new AppError("Cannot find user you are trying to add. Maybe he / she has blocked you", 404));

  const didIBlockedUser = req.user.blockList.find(u => u.toString() === userId);
  if(didIBlockedUser) return next(new AppError("You blocked this user. Unblock user before trying to add as friend", 400));

  const myList = await Friends.findOne({user: req.user._id});
  if(!myList) return next(new AppError("Unable to find your friend list. Try refreshing the page", 404));

  const alreadyFriend = myList.friends.find(u => u.toString() === userId);
  if(alreadyFriend) return next(new AppError("This person is already in your friend list", 400));
  const alreadySentRequest = myList.sentPendingRequests.find(u => u.toString() === userId);
  if(alreadySentRequest) return next(new AppError("You already sent friend request to this person", 400));
  const alreadyReceivedRequest = myList.receivedPendingRequests.find(u => u.toString() === userId);
  if(alreadyReceivedRequest) return next(new AppError("This person already sent you friend request. Please confirm it properly", 400));

  const userFriendList = await Friends.findOne({user: userId});
  if(!userFriendList) return next(new AppError("Unable to find user's friend list. Try refreshing the page", 400));

  const userToAddSettings = await Settings.findOne({user: userId});

  if(!userToAddSettings) return next(new AppError("Can't find user. Try refreshing the page", 404));

  let mutualFriends = findMutualFriends(myList.friends, userFriendList.friends);

  if(userToAddSettings.friendRequests.whoCanAddMe === "none") return next(new AppError("This person doesn't receive friend request according to their account settings", 400));
  if(userToAddSettings.friendRequests.whoCanAddMe === "friendsOfFriends" && mutualFriends.length === 0) {
    return next(new AppError("This person receives requests only from people that have at least one mutual friend", 400));
  } 
  myList.sentPendingRequests.push(userId);
  await myList.save();
  userFriendList.receivedPendingRequests.push(req.user._id);
  await userFriendList.save();
  await ActivityLog.create({
    user: req.user._id,
    action: "sentFriendRequest",
    targetUser: userId,
    logText: `You sent friend request to ${user.fullName}`,
  });

  await Notification.deleteMany({user: userId, notificationType: "receivedFriendRequest", fromUser: req.user._id});

  const userNotification = await Notification.create({
    user: userId,
    notificationType: "receivedFriendRequest",
    fromUser: req.user._id,
    text: "sent you a friend request"
  });
  const populated = await userNotification.populate("fromUser", "_id fullName profilePhotoUrl");

  const authUserSettings = await Settings.findOne({user: req.user._id}).select("messaging");

  res.status(200).json({
    status: "success",
    userNotification: populated,
    user: {
      user: {
        _id: user._id,
        fullName: user.fullName,
        profilePhotoUrl: user.profilePhotoUrl
      },
      mutualFriends,
      whoCanMessageUser: userToAddSettings.messaging.whoCanMessageMe
    },
    authUserWhoCanMessage: authUserSettings.messaging.whoCanMessageMe
  });
});

exports.unsendFriendRequest = catchAsync(async(req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if(!user || (user && user.active === false)) return next(new AppError("User not found. Try refreshing the page", 404));
  const myList = await Friends.findOne({user: req.user._id});
  if(!myList) return next(new AppError("Can't find your friend list. Try refreshing the page", 404));

  const userList = await Friends.findOne({user: userId});
  if(!userList) return next(new AppError("Can't find user's friend list. Try refreshing the page", 404));

  const myNewSentPendingList = myList.sentPendingRequests.filter(u => u.toString() !== userId);
  myList.sentPendingRequests = myNewSentPendingList;
  await myList.save();

  const userNewReceivedPendingList = userList.receivedPendingRequests.filter(u => u.toString() !== req.user._id.toString());
  userList.receivedPendingRequests = userNewReceivedPendingList;
  await userList.save();

  const friendRequestNotification = await Notification.findOne({user: userId, fromUser: req.user._id, notificationType: "receivedFriendRequest"});
  if(friendRequestNotification) {
    await friendRequestNotification.delete();
  }

  await Notification.deleteMany({user: userId, fromUser: req.user._id, notificationType: "receivedFriendRequest"});

  await ActivityLog.create({
    user: req.user._id,
    action: "unsendFriendRequest",
    targetUser: userId,
    logText: `You unsend friend request to ${user.fullName}`
  });

  res.status(200).json({
    status: "success",
    authUserId: req.user._id
  });
});

exports.acceptFriendRequest = catchAsync(async(req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if(!user || (user && user.active === false)) return next(new AppError("User not found. Try refreshing the page", 404));
  const myList = await Friends.findOne({user: req.user._id});
  if(!myList) return next(new AppError("Can't find your friend list. Try refreshing the page", 404));

  const userList = await Friends.findOne({user: userId});
  if(!userList) return next(new AppError("Can't find user's friend list. Try refreshing the page", 404));

  const isUserInPendingList = myList.receivedPendingRequests.find(u => u.toString() === userId);
  const amIInPendingList = userList.sentPendingRequests.find(u => u.toString() === req.user._id.toString());
  if(!isUserInPendingList || !amIInPendingList) return next(new AppError("This user is not in your pending list. Maybe request was withdrawned", 404));

  const myNewReceivedPendingList = myList.receivedPendingRequests.filter(u => u.toString() !== userId);
  myList.receivedPendingRequests = myNewReceivedPendingList;
  myList.friends.push(userId);
  await myList.save();

  const userNewSentPendingList = userList.sentPendingRequests.filter(u => u.toString() !== req.user._id.toString());
  userList.sentPendingRequests = userNewSentPendingList;
  userList.friends.push(req.user._id);
  await userList.save();

  const userToAddSettings = await Settings.findOne({user: userId}).select("messaging");

  const mutualFriends = findMutualFriends(myList.friends, userList.friends);

  await ActivityLog.create({
    user: req.user._id,
    targetUser: userId,
    action: "acceptFriendRequest",
    logText: `You accepted friend request from ${user.fullName}`
  });

  const userNotification = await Notification.create({
    user: userId,
    notificationType: "acceptedFriendRequest",
    fromUser: req.user._id,
    text: "accepted your friend request"
  });
  const populated = await userNotification.populate("fromUser", "_id fullName profilePhotoUrl");

  const authUserSettings = await Settings.findOne({user: req.user._id}).select("messaging");

  res.status(200).json({
    status: "success",
    user: {
      user: {
        _id: user._id,
        fullName: user.fullName,
        profilePhotoUrl: user.profilePhotoUrl
      },
      mutualFriends,
      whoCanMessageUser: userToAddSettings.messaging.whoCanMessageMe
    },
    authUserWhoCanMessage: authUserSettings.messaging.whoCanMessageMe,
    userNotification: populated
  });
});

exports.declineFriendRequest = catchAsync(async(req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if(!user || (user && user.active === false)) return next(new AppError("User not found. Try refreshing the page", 404));
  const myList = await Friends.findOne({user: req.user._id});
  if(!myList) return next(new AppError("Can't find your friend list. Try refreshing the page", 404));

  const userList = await Friends.findOne({user: userId});
  if(!userList) return next(new AppError("Can't find user's friend list. Try refreshing the page", 404));

  const isUserInPendingList = myList.receivedPendingRequests.find(u => u.toString() === userId);
  const amIInPendingList = userList.sentPendingRequests.find(u => u.toString() === req.user._id.toString());
  if(!isUserInPendingList || !amIInPendingList) return next(new AppError("This user is not in your pending list. Maybe request was withdrawned", 404));

  const myNewReceivedPendingList = myList.receivedPendingRequests.filter(u => u.toString() !== userId);
  myList.receivedPendingRequests = myNewReceivedPendingList;
  await myList.save();

  const userNewSentPendingList = userList.sentPendingRequests.filter(u => u.toString() !== req.user._id.toString());
  userList.sentPendingRequests = userNewSentPendingList;
  await userList.save();

  await ActivityLog.create({
    user: req.user._id,
    targetUser: userId,
    action: "declineFriendRequest",
    logText: `You declined friend request from ${user.fullName}`
  });

  res.status(200).json({
    status: "success"
  });
});

exports.unfriend = catchAsync(async(req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if(!user || (user && user.active === false)) return next(new AppError("User not found. Try refreshing the page", 404));

  const myList = await Friends.findOne({user: req.user._id});
  if(!myList) return next(new AppError("Can't find your friend list. Try refreshing the page", 404));

  const userList = await Friends.findOne({user: userId});
  if(!userList) return next(new AppError("Can't find user's friend list. Try refreshing the page", 404));

  const isUserInMyFriends = myList.friends.find(u => u.toString() === userId);
  const amIInUsersFriends = userList.friends.find(u => u.toString() === req.user._id.toString());
  if(!isUserInMyFriends || !amIInUsersFriends) return next(new AppError(new AppError("You don't have this user in your friend list, so no need to unfriend", 400)));

  const myNewFriendList = myList.friends.filter(u => u.toString() !== userId);
  myList.friends = myNewFriendList;
  await myList.save();

  const userNewFriendList = userList.friends.filter(u => u.toString() !== req.user._id.toString());
  userList.friends = userNewFriendList;
  await userList.save();

  await ActivityLog.create({
    user: req.user._id,
    action: "unfriendUser",
    targetUser: userId,
    logText: `You removed ${user.fullName} from your friend list`
  });

  res.status(200).json({
    status: "success",
    authUserId: req.user._id
  });
});

exports.getMyFriends = catchAsync(async(req, res, next) => {
  const friends = await Friends.findOne({user: req.user._id})
    .populate({
      path: "friends",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    })
    .populate({
      path: "sentPendingRequests",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    })
    .populate({
      path: "receivedPendingRequests",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    });
  if(!friends) return next(new AppError("Friend list not found. Try refreshing the page", 404));

  let sendFriendLists = {
    sentPendingRequests: [],
    receivedPendingRequests: [],
    friends: []
  };

  for(const friend of friends.friends) {
    const friendUser = await User.findById(friend);
    if(friendUser.active) {
      const friendList = await Friends.findOne({user: friend}).select("friends user");
      const mutuals = findMutualFriends(friends.friends.map(u => u._id), friendList.friends);
      sendFriendLists.friends.push({
        user: friend,
        mutualFriends: mutuals
      });
    }
  }

  for(const friend of friends.sentPendingRequests) {
    const friendUser = await User.findById(friend);
    if(friendUser.active) {
      const friendList = await Friends.findOne({user: friend}).select("friends user");
      const settings = await Settings.findOne({user: friend}).select("messaging");
      const mutuals = findMutualFriends(friends.friends.map(u => u._id), friendList.friends);
      sendFriendLists.sentPendingRequests.push({
        user: friend,
        mutualFriends: mutuals,
        whoCanMessageUser: settings.messaging.whoCanMessageMe
      });
    }
  }

  for(const friend of friends.receivedPendingRequests) {
    const friendUser = await User.findById(friend);
    if(friendUser.active) {
      const friendList = await Friends.findOne({user: friend}).select("friends user");
      const settings = await Settings.findOne({user: friend}).select("messaging");
      const mutuals = findMutualFriends(friends.friends.map(u => u._id), friendList.friends);
      sendFriendLists.receivedPendingRequests.push({
        user: friend,
        mutualFriends: mutuals,
        whoCanMessageUser: settings.messaging.whoCanMessageMe
      });
    }
  }

  res.status(200).json({
    status: "success",
    friends: sendFriendLists
  });
});

exports.getUserFriends = catchAsync(async(req, res, next) => {
  const { userId } = req.params;
  const userFriends = await Friends.findOne({user: userId}).select("friends").populate({
    path: "friends",
    model: "User",
    select: "_id fullName profilePhotoUrl"
  });

  const userSettings = await Settings.findOne({user: userId}).select("profileAccess");

  let sentFriendList = [];

  if(!userFriends || !userSettings) return next(new AppError("User friend list not found. Try refreshing the page", 404));
  
  if(userSettings.profileAccess.whoCanSeeMyFriendsList !== "none") {
    const myFriendList = await Friends.findOne({user: req.user._id});

    if(userSettings.profileAccess.whoCanSeeMyFriendsList === "everyone") {
      for(const friend of userFriends.friends) {
        const friendUser = await User.findById(friend);
        if(friendUser.active) {
          const friendList = await Friends.findOne({user: friend}).select("friends user");
          const settings = await Settings.findOne({user: friend});
          const mutuals = findMutualFriends(myFriendList.friends, friendList.friends);
          if(!req.user.blockList.includes(friend._id)) {
              sentFriendList.push({
                user: friend,
                mutualFriends: mutuals,
                whoCanMessageUser: settings.messaging.whoCanMessageMe,
                whoCanAddUser: settings.friendRequests.whoCanAddMe
              });
            }
        }
      }
    } else if(userSettings.profileAccess.whoCanSeeMyFriendsList === "friends") {
      const amIFriend = userFriends.friends.find(user => user.toString() === req.user._id.toString());

      if(amIFriend) {
        for(const friend of userFriends.friends) {
          const friendUser = await User.findById(friend);
          if(friendUser.active) {
            const friendList = await Friends.findOne({user: friend}).select("friends user");
            const settings = await Settings.findOne({user: friend});
            const mutuals = findMutualFriends(myFriendList.friends, friendList.friends);
            if(!req.user.blockList.includes(friend._id)) {
              sentFriendList.push({
                user: friend,
                mutualFriends: mutuals,
                whoCanMessageUser: settings.messaging.whoCanMessageMe,
                whoCanAddUser: settings.friendRequests.whoCanAddMe
              });
            }
          }
        }
      }
    } else if(userSettings.profileAccess.whoCanSeeMyFriendsList === "friendsOfFriends") {
      const haveMutuals = findMutualFriends(myFriendList.friends, userFriends.friends.map(u => u._id));
      if(haveMutuals.length > 0) {
        for(const friend of userFriends.friends) {
          const friendUser = await User.findById(friend);
          if(friendUser.active) {
            const friendList = await Friends.findOne({user: friend}).select("friends user");
            const settings = await Settings.findOne({user: friend});
            const mutuals = findMutualFriends(myFriendList.friends, friendList.friends);
            if(!req.user.blockList.includes(friend._id)) {
              sentFriendList.push({
                user: friend,
                mutualFriends: mutuals,
                whoCanMessageUser: settings.messaging.whoCanMessageMe,
                whoCanAddUser: settings.friendRequests.whoCanAddMe
              });
            }
          }
        }
      }
    }
  }
  
  res.status(200).json({
    status: "success",
    friends: sentFriendList
  });
});