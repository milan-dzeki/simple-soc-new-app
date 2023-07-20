const io = require("socket.io");
const User = require("./models/userModel");

const runSocket = (server, activeUsers, addActiveUser, removeActiveUser) => {
  const IO = io(server, {
    cors: {
      origin: "*"
    }
  });

  IO.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("addActiveUser", async({userId}) => {
      const activeUsers = await addActiveUser(userId, socket.id);
      IO.emit("getActiveUsers", {activeUsers});
    });

    // socket.on("sendMessage", ({
    //   userId,
    //   chatId,
    //   newLastMessage,
    //   message
    // }) => {
    //   const user = activeUsers.find(user => user.userId === userId);
    //   if(user) {
    //     socket.to(user.socketId).emit("receiveMessage", {userId, chatId, newLastMessage, message});
    //   }
    // });
    socket.on("sendMessage", ({
      userId,
      chatId,
      newLastMessage,
      message
    }) => {
      const user = activeUsers.find(user => user.userId === userId);
      if(user) {
        user.socketIds.forEach(socketId => {
          socket.to(socketId).emit("receiveMessage", {userId, chatId, newLastMessage, message});
        });
      }
    });
    

    // socket.on("userSeenMessages", ({
    //   userId,
    //   chatId,
    //   newUnreadMsgsList,
    //   hasLastMsg
    // }) => {
    //   const user = activeUsers.find(user => user.userId === userId);
    //   if(user) {
    //     socket.to(user.socketId).emit("seenMessages", {userId, chatId, newUnreadMsgsList, hasLastMsg});
    //   }
    // });

    socket.on("userSeenMessages", ({
      userId,
      chatId,
      newUnreadMsgsList,
      hasLastMsg
    }) => {
      const user = activeUsers.find(user => user.userId === userId);
      if(user) {
        user.socketIds.forEach(socketId => {
          socket.to(socketId).emit("seenMessages", {userId, chatId, newUnreadMsgsList, hasLastMsg});
        });
      }
    });

    // socket.on("sendNotificationList", ({notifications}) => {
    //   const userIds = notifications.map(notif => notif.user);

    //   userIds.forEach(userId => {
    //     const userIsActive = activeUsers.find(user => user.userId === userId);

    //     if(userIsActive) {
    //       const targetNotification = notifications.find(notif => notif.user === userIsActive.userId);
    //       if(targetNotification) {
    //         socket.to(userIsActive.socketId).emit("receiveNotification", {notification: targetNotification});
    //         console.log("TARGET", targetNotification);
    //       }
          
    //     }
    //   });
    // });
    socket.on("sendNotificationList", ({notifications}) => {
      const userIds = notifications.map(notif => notif.user);

      userIds.forEach(userId => {
        const userIsActive = activeUsers.find(user => user.userId === userId);

        if(userIsActive) {
          const targetNotification = notifications.find(notif => notif.user === userIsActive.userId);
          if(targetNotification) {
            userIsActive.socketIds.forEach(socketId => {
              socket.to(socketId).emit("receiveNotification", {notification: targetNotification});
            });
            
            console.log("TARGET", targetNotification);
          }
          
        }
      });
    });

    // socket.on("sendSingleNotification", ({notification}) => {
    //   const user = activeUsers.find(user => user.userId.toString() === notification.user.toString());
      
    //   if(user) {
    //     socket.to(user.socketId).emit("receiveNotification", {notification});
    //   }
    // });
    socket.on("sendSingleNotification", ({notification}) => {
      const user = activeUsers.find(user => user.userId.toString() === notification.user.toString());
      
      if(user) {
        user.socketIds.forEach(socketId => {
          socket.to(socketId).emit("receiveNotification", {notification});
        });
      }
    });

    // socket.on("sendFriendRequest", ({notification, user}) => {
    //   const userExists = activeUsers.find(user => user.userId.toString() === notification.user.toString());
      
    //   if(userExists) {
    //     socket.to(userExists.socketId).emit("receiveFriendRequest", {notification, user});
    //   }
    // });
    socket.on("sendFriendRequest", ({notification, user}) => {
      const userExists = activeUsers.find(user => user.userId.toString() === notification.user.toString());
      
      if(userExists) {
        userExists.socketIds.forEach(socketId => {
          socket.to(socketId).emit("receiveFriendRequest", {notification, user});
        });
        
      }
    });
    
    // socket.on("unsendFriendRequest", ({authUserId, targetUserId}) => {
    //   const user = activeUsers.find(user => user.userId.toString() === targetUserId);

    //   if(user) {
    //     socket.to(user.socketId).emit("friendRequestWithdrawn", {userId: authUserId});
    //   }
    // });
    socket.on("unsendFriendRequest", ({authUserId, targetUserId}) => {
      const user = activeUsers.find(user => user.userId.toString() === targetUserId);

      if(user) {
        user.socketIds.forEach(socketId => {
          socket.to(socketId).emit("friendRequestWithdrawn", {userId: authUserId});
        });
        
      }
    });

    // socket.on("acceptFriendRequest", ({notification, user}) => {
    //   const userExists = activeUsers.find(user => user.userId.toString() === notification.user.toString());

    //   if(userExists) {
    //     socket.to(userExists.socketId).emit("friendRequestAccepted", {notification, user});
    //   }
    // });

    socket.on("acceptFriendRequest", ({notification, user}) => {
      const userExists = activeUsers.find(user => user.userId.toString() === notification.user.toString());

      if(userExists) {
        userExists.socketIds.forEach(socketId => {
          socket.to(socketId).emit("friendRequestAccepted", {notification, user});
        });
        
      }
    });

    // socket.on("unfriend", ({authUserId, targetUserId}) => {
    //   const user = activeUsers.find(user => user.userId.toString() === targetUserId);

    //   if(user) {
    //     socket.to(user.socketId).emit("unfriended", {userId: authUserId});
    //   }
    // });
    socket.on("unfriend", ({authUserId, targetUserId}) => {
      const user = activeUsers.find(user => user.userId.toString() === targetUserId);

      if(user) {
        user.socketIds.forEach(socketId => {
          socket.to(socketId).emit("unfriended", {userId: authUserId});
        });
        
      }
    });

    socket.on("logout", async({userId}) => {
      const disconnectingUser = activeUsers.find(user => user.userId === userId);
      if(disconnectingUser) {
        await User.findByIdAndUpdate(disconnectingUser.userId, {lastTimeSeen: Date.now()});
      }
      // const newActiveUsers = await removeActiveUser(disconnectingUser.socketId);
      const newActiveUsers = await removeActiveUser(socket.id);
      
      IO.emit("getActiveUsers", {activeUsers: newActiveUsers});
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("disconnect", async() => {
      console.log("User disconnected");
      const activeUsers = await removeActiveUser(socket.id);
      IO.emit("getActiveUsers", {activeUsers});
    });
  });
};

module.exports = runSocket;