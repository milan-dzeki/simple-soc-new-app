const findMutualFriends = require("./findMutualFriends");

module.exports = async(myFriendList, myId, userIds, Friends, Settings) => {
  const friendLists = await Friends.find({user: {$in: userIds}}).populate("user", "_id fullName profilePhotoUrl");

  const usersSettings = await Settings.find({user: {$in: userIds}}).select("+ user friendRequests messaging");
  
  const usersWithMutuals = friendLists.map(fl => {
    const mf = findMutualFriends(myFriendList.friends, fl.friends);
    const settings = usersSettings.find(sett => sett.user.toString() === fl.user._id.toString());
    let friendStatus = "none";
    const isFriend = fl.friends.find(u => u.toString() === myId.toString());
    const haveIRequested = fl.receivedPendingRequests.find(u => u.toString() === myId.toString());
    const haveIReceivedRequest = fl.sentPendingRequests.find(u => u.toString() === myId.toString());
    if(isFriend) {
      friendStatus = "friends";
    } else if(haveIRequested) {
      friendStatus = "requestSent"
    } else if(haveIReceivedRequest) {
      friendStatus = "requestReceived";
    }
  
    return {
      user: fl.user,
      mutualFriends: mf,
      friendStatus,
      settings: {
        whoCanAddMe: settings.friendRequests.whoCanAddMe,
        whoCanMessageMe: settings.messaging.whoCanMessageMe
      }
    }
  });

  return usersWithMutuals;
};