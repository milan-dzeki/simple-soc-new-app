const validator = require("validator");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const cloudinaryConfig = require("../utils/cloudinaryConfig");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const findMutualFriends = require("../utils/findMutualFriends");
const formatSearchUsers = require("../utils/formatSearchUsers");
const Friends = require("../models/friendsModel");
const Settings = require("../models/settingsModel");
const User = require("../models/userModel");
const ActivityLog = require("../models/activityLogModel");
const Post = require("../models/postModel");
const months = require("../utils/months");

cloudinary.config(cloudinaryConfig);

exports.getLastJoinedUsers = catchAsync(async(req, res, next) => {
  const myFriendList = await Friends.findOne({user: req.user._id});

  const users = await User.find({
    $and: [
      {email: {$ne: req.user.email}},
      { _id: {$nin: req.user.blockList}},
      {blockList: {$nin: req.user._id}},
      {_id: {$nin: myFriendList.friends}},
      {active: true}
    ]
  }).sort("-createdAt").limit(10);

  const userIds = users.map(u => u._id);

  const usersWithMutuals = await formatSearchUsers(myFriendList, req.user._id, userIds, Friends, Settings);
  
  res.status(200).json({
    status: "success",
    users: usersWithMutuals
  });
});

exports.searchUsersByName = catchAsync(async(req, res, next) => {
  const { search } = req.params;
  if(!search || (search && search.trim().length === 0)) {
    
    return res.status(200).json({
      status: "success",
      users: []
    });
  }

  let query = {};
  let searchSplit = search.split(" ");
  if(searchSplit.length > 2) return next(new AppError("Search text must me maximum 2 characters long", 400));

  if(searchSplit.length === 1) {
    query = {
      $and: [
        {email: {$ne: req.user.email}},
        {_id: {$nin: req.user.blockList}},
        {blockList: {$nin: req.user._id}},
        {active: true},
        {
          $or: [
            {firstName: {$regex: "^" + search, $options: "i"}},
            {lastName: {$regex: "^" + search, $options: "i"}}
          ]
        }
      ]
    };
  } else if(searchSplit.length === 2) {
    query = {
      $and: [
        {email: {$ne: req.user.email}},
        { _id: {$nin: req.user.blockList}},
        {blockList: {$nin: req.user._id}},
        {active: true},
        {
          $or: [
            {
              $and: [
                {firstName: {$regex: "^" + searchSplit[0], $options: "i"}},
                {lastName: {$regex: "^" + searchSplit[1], $options: "i"}}
              ]
            },
            {
              $and: [
                {firstName: {$regex: "^" + searchSplit[1], $options: "i"}},
                {lastName: {$regex: "^" + searchSplit[0], $options: "i"}}
              ]
            }
          ]
        }
      ]
    };
  }
  await ActivityLog.create({
    user: req.user._id,
    action: "searchUser",
    logText: `You searched users by word: "${search}"`
  });

  const users = await User.find(query);

  const userIds = users.map(u => u._id);

  const myFriendList = await Friends.findOne({user: req.user._id});

  const usersWithMutuals = await formatSearchUsers(myFriendList, req.user._id, userIds, Friends, Settings);

  res.status(200).json({
    status: "success",
    users: usersWithMutuals
  });
});

exports.peopleYouMayKnow = catchAsync(async(req, res, next) => {
  const myFriendList = await Friends.findOne({user: req.user._id}).select("friends");

  const friendsOfFriends = await Friends.find({user: {$in: myFriendList.friends}}).select("friends");

  const friendsOfFriendsIds = [...new Set(friendsOfFriends.map(list => {
    return list.friends.map(friend => friend.toString());
  }).flat())].filter(friend => friend !== req.user._id.toString() && !req.user.blockList.includes(friend));

  const usersWithMutuals = await formatSearchUsers(myFriendList, req.user._id, friendsOfFriendsIds, Friends, Settings);

  // const filteredUsersWithMutuals = usersWithMutuals.filter(list => list.mutualFriends.length > 0);

  res.status(200).json({
    status: "success",
    users: usersWithMutuals
  });
});

exports.getSingleUserAndUsersPosts = catchAsync(async(req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if(!user || (user && !user.active)) return next(new AppError("User not found", 404));
  
  const haveIBlockedUser = req.user.blockList.find(u => u.toString() === userId);
  
  if(haveIBlockedUser) return next(new AppError("You cannot see this user's page because you blocked this user. Unblock user in order to access", 400));

  const amIBlocked = user.blockList.find(u => u.toString() === req.user._id.toString());
  if(amIBlocked || user.active === false) return next(new AppError("User not found", 404));

  const userSettings = await Settings.findOne({user: userId}).select("-__v -user -_id");

  let userPosts = [];

  const myFriendList = await Friends.findOne({user: req.user._id});
  const userFriendList = await Friends.findOne({user: userId});
  
  const amIFriend = userFriendList.friends.find(u => u.toString() === req.user._id.toString());
  let haveMutualFriends = false;

  const haveMutuals = findMutualFriends(myFriendList.friends, userFriendList.friends);

  if(haveMutuals.length > 0) {
    haveMutualFriends = true;
  }

  if(
    userSettings.profileAccess.whoCanSeeMyPosts === "everyone"
    || (userSettings.whoCanSeeMyPosts === "friends" && amIFriend)
    || (userSettings.profileAccess.whoCanSeeMyPosts === "friendsOfFriends" && haveMutuals.length > 0)
  ) {
    userPosts = await Post
      .find({user: userId})
      .populate("user", "_id fullName profilePhotoUrl")
      .populate("taggs", "_id fullName")
      .populate("likes", "_id fullName profilePhotoUrl")
      .populate({
        path: "comments",
        model: "Comment",
        populate: [{
          path: "commentator",
          model: "User",
          select: "_id fullName profilePhotoUrl"
        }, {
          path: "likes",
          model: "User",
          select: "_id fullName profilePhotoUrl"
        }]
      })
      .sort("-createdAt");
  }
  
  let friendStatus = "none";
  const haveISentRequest = myFriendList.sentPendingRequests.find(fr => fr.toString() === userId);
  const haveIReceivedRequest = myFriendList.receivedPendingRequests.find(fr => fr.toString() === userId);
  
  if(amIFriend) {
    friendStatus = "friends";
  } else if(haveISentRequest) {
    friendStatus = "sentFriendRequest";
  } else if(haveIReceivedRequest) {
    friendStatus = "receivedFriendRequest";
  }

  res.status(200).json({
    status: "success",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      profilePhotoUrl: user.profilePhotoUrl,
      createdAt: user.createdAt
    },
    posts: userPosts,
    userSettings,
    friendStatus,
    haveMutualFriends
  });
});

exports.blockUser = catchAsync(async(req, res, next) => {
  const { userId, relationToUser } = req.body;

  const user = await User.findById(userId);
  if(!user && (user && user.active === false)) return next(new AppError("User you are trying to block doesn't appear to exist", 404)); 

  const me = await User.findById(req.user._id);

  const amIBlocked = user.blockList.find(u => u.toString() === me._id.toString());
  if(amIBlocked) return next(new AppError("User you are trying to block doesn't appear to exist", 404)); 

  const isUserBlocked = me.blockList.find(u => u.toString() === userId);
  if(isUserBlocked) return next(new AppError("You already blocked this user", 400));

  me.blockList.push(userId);
  await me.save();

  user.blockedMe.push(me._id);
  await user.save();
  
  if(relationToUser && relationToUser !== "none") {
    const myFriendList = await Friends.findOne({user: me._id});
    const userFriendList = await Friends.findOne({user: userId});

    if(relationToUser === "friends") {
      const myNewFriendList = myFriendList.friends.filter(u => u.toString() !== userId);
      myFriendList.friends = myNewFriendList;

      const userNewFriendList = userFriendList.friends.filter(u => u.toString() !== me._id.toString());
      userFriendList.friends = userNewFriendList;
    } else if(relationToUser === "receivedPendingRequests") {
      const myNewReceivedList = myFriendList.receivedPendingRequests.filter(u => u.toString() !== userId);
      myFriendList.receivedPendingRequests = myNewReceivedList;

      const userNewSentPendingList = userFriendList.sentPendingRequests.filter(u => u.toString() !== me._id.toString());
      userFriendList.sentPendingRequests = userNewSentPendingList;
    } else if(relationToUser === "sentPendingRequests") {
      const myNewSentPendingList = myFriendList.sentPendingRequests.filter(u => u.toString() !== userId);
      myFriendList.sentPendingRequests = myNewSentPendingList;

      const userNewReceivedList = userFriendList.receivedPendingRequests.filter(u => u.toString() !== me._id.toString());
      userFriendList.receivedPendingRequests = userNewReceivedList;
    }

    await myFriendList.save();
    await userFriendList.save();
  }

  await ActivityLog.create({
    user: me._id,
    action: "blockUser",
    targetUser: user._id,
    logText: `You blocked user "${user.fullName}"`
  });

  res.status(200).json({
    status: "success",
    blockedUser: {
      _id: user._id,
      fullName: user.fullName,
      profilePhotoUrl: user.profilePhotoUrl
    }
  });
});

exports.unblockUser = catchAsync(async(req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if(!user) return next(new AppError("User you are trying to unblock doesn't appear to exist", 404)); 

  const me = await User.findById(req.user._id);

  const isUserInList = me.blockList.find(u => u.toString() === userId);
  if(!isUserInList) return next(new AppError("This user is not in your block list", 404));
  const newBlockList = me.blockList.filter(u => u.toString() !== userId);
  me.blockList = newBlockList;
  await me.save();

  const newUserBlockedMe = user.blockedMe.filter(u => u.toString() !== req.user._id.toString());
  user.blockedMe = newUserBlockedMe;
  await user.save();

  await ActivityLog.create({
    user: me._id,
    action: "unblockUser",
    targetUser: user._id,
    logText: `You unblocked user "${user.fullName}"`
  });

  res.status(200).json({
    status: "success"
  });
});

exports.deactivateAccount = catchAsync(async(req, res, next) => {
  const me = await User.findById(req.user._id);

  me.active = false;
  await me.save();

  res.status(200).json({
    status: "success"
  });
});


exports.editPassword = catchAsync(async(req, res, next) => {
  const { email, currentPassword, newPassword, newPasswordConfirm } = req.body;

  if(!email || !currentPassword || !newPassword || newPasswordConfirm) return next(new AppError("All fields are required", 400));
  if(req.user.email !== email) return next(new AppError("Invalid credentials", 400));

  if(newPassword !== newPasswordConfirm) return next(new AppError("New password and confirmation password must be the same", 400));
  
  const user = await User.findById(req.user._id).select("+password");

  const comparePasswords = await bcrypt.compare(currentPassword, user.password);
  if(!comparePasswords) return next(new AppError("Invalid credentials", 400));

  const newHashedPassword = await bcrypt.hash(newPassword);
  user.password = newHashedPassword;
  await user.save({
    validateBeforeSave: false
  });

  res.status(200).json({
    status: "success"
  });
});

exports.editUserData = catchAsync(async(req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    birthDay,
    birthMonth,
    birthYear,
    gender
  } = req.body;

  if(!firstName || !lastName) return next(new AppError("First and Last names are required", 400));
  if(firstName.split(" ").length >  1 || lastName.split(" ").length > 1) return next(new AppError("First Name and Last Name must be single words", 400));
  if(!email || (email && !validator.isEmail(email))) return next(new AppError("Invalid email format", 400));

  let dateOfBirth = "";
  if(birthDay && birthMonth && birthYear) {
    const monthNum = months.findIndex(m => m === birthMonth.toLowerCase());
    if(monthNum !== -1) {
      dateOfBirth = `${birthDay}.${monthNum + 1}.${birthYear}`;
    }
  }

  const updatedUser = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email,
    dateOfBirth,
    gender
  };

  await User.findByIdAndUpdate(req.user._id, updatedUser);

  res.status(200).json({ status: "success", user: {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email,
    gender,
    dateOfBirth
  } });
});

exports.uploadNewProfilePhoto = catchAsync(async(req, res, next) => {
  const photo = req.files.photo;
  if(!photo) return next(new AppError("Photo is required", 400));

  const user = await User.findById(req.user._id);

  if(user.profilePhotoPublicId) {
    await cloudinary.uploader.destroy(user.profilePhotoPublicId);
  }

  const result = await cloudinary.uploader.upload(photo.path);
  user.profilePhotoUrl = result.secure_url;
  user.profilePhotoPublicId = result.public_id;

  await user.save({
    validateBeforeSave: false
  });

  res.status(200).json({
    status: "success",
    newPhoto: user.profilePhotoUrl
  });
});

exports.removeProfilePhoto = catchAsync(async(req, res, next) => {
  const user = await User.findById(req.user._id);

  if(user.profilePhotoPublicId) {
    await cloudinary.uploader.destroy(user.profilePhotoPublicId);
  }

  user.profilePhotoUrl = "";
  user.profilePhotoPublicId = "";

  await user.save({
    validateBeforeSave: false
  });

  res.status(204).json({
    status: "success"
  });
});