const findMutualFriends = (currentUserFriendList, userFriendList) => {
  let mutualFriendsIds = [];

  currentUserFriendList.forEach(currUserFriend => {
    userFriendList.forEach(userFriend => {
      if(currUserFriend.toString() === userFriend.toString()) {
        mutualFriendsIds.push(userFriend);
      }
    });
  });

  return mutualFriendsIds;
};

module.exports = findMutualFriends;