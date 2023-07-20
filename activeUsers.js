const User = require("./models/userModel");

let activeUsers = [];

const addActiveUser = async(userId, socketId) => {
  const isUserInList = activeUsers.find(user => user.userId === userId);
  if(!isUserInList) {
    activeUsers.push({userId, socketIds: [socketId]});
    await User.findByIdAndUpdate(userId, {lastTimeSeen: Date.now()});
  } else {
    const userIndex = activeUsers.findIndex(user => user.userId === userId);
    if(userIndex !== -1) {
      isUserInList.socketIds.push(socketId);
      activeUsers[userIndex] = isUserInList;
    }
  }

  return activeUsers;
};

const removeActiveUser = async(socketId) => {
  const disconnectingUser = activeUsers.find(user => user.socketIds.includes(socketId));
  if(disconnectingUser) {
    await User.findByIdAndUpdate(disconnectingUser.userId, {lastTimeSeen: Date.now()});

    let newActiveUsers = [...activeUsers];

    const userIndex = activeUsers.find(user => user.socketIds.includes(socketId));

    const newSocketIds = disconnectingUser.socketIds.filter(id => id !== socketId);
    disconnectingUser.socketIds = newSocketIds;
    newActiveUsers[userIndex] = disconnectingUser;

    if(disconnectingUser.socketIds.length === 0) {
      newActiveUsers = activeUsers.filter(user => user.userId !== disconnectingUser.userId);
    }

  //   let newActiveUsers = [...activeUsers];
  //   if(disconnectingUser.socketIds.length === 1) {
  //     newActiveUsers = activeUsers.filter(user => user.socketIds.includes(socketId));
  //   } else {
  //     if(userIndex !== -1) {
        // const newSocketIds = disconnectingUser.socketIds.filter(id => id !== socketId);
        // disconnectingUser.socketIds = newSocketIds;
        // newActiveUsers[userIndex] = disconnectingUser;
  //     }
  //   }
  
  //   return newActiveUsers;
  // }
    return newActiveUsers;
  }
  return activeUsers;
};

// const addActiveUser = async(userId, socketId) => {
//   const isUserInList = activeUsers.find(user => user.userId === userId);
//   if(!isUserInList) {
//     activeUsers.push({userId, socketId});
//     await User.findByIdAndUpdate(userId, {lastTimeSeen: Date.now()});
//   }

//   return activeUsers;
// };

// const removeActiveUser = async(socketId) => {
//   const disconnectingUser = activeUsers.find(user => user.socketId === socketId);
//   if(disconnectingUser) {
//     await User.findByIdAndUpdate(disconnectingUser.userId, {lastTimeSeen: Date.now()});
//   }

//   const newActiveUsers = activeUsers.filter(user => user.socketId !== socketId);
//   console.log("NEW", newActiveUsers);
//   return newActiveUsers;
// };

module.exports = {
  activeUsers,
  addActiveUser,
  removeActiveUser,
};