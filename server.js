const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const io = require("socket.io");
const User = require("./models/userModel");

dotenv.config();

const app = require("./app");

const DB = process.env.DATABASE_URL;
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

let activeUsers = [];

const addActiveUser = (userId, socketId) => {
  const isUserInList = activeUsers.find(user => user.userId.toString() === userId.toString());
  if(!isUserInList) {
    activeUsers = [
      ...activeUsers.map(user => ({userId: user.userId, socketIds: [...user.socketIds]})), 
      {userId, socketIds: [socketId]}
    ];
  } else {
    const userIndex = activeUsers.findIndex(user => user.userId.toString() === userId.toString());
    if(userIndex !== -1) {
      const updatedUser = {
        ...isUserInList,
        socketIds: [...isUserInList.socketIds, socketId]
      }
      
      activeUsers[userIndex] = updatedUser;
    }
  }

  return activeUsers;
};

const removeActiveUser = async(socketId) => {
  const disconnectingUser = activeUsers.find(user => user.socketIds.includes(socketId));
  if(disconnectingUser) {
    await User.findByIdAndUpdate(disconnectingUser.userId, {lastTimeSeen: Date.now()});

    let newActiveUsers = activeUsers.map(user => ({userId: user.userId, socketIds: [...user.socketIds]}));

    const userIndex = activeUsers.findIndex(user => user.socketIds.includes(socketId));

    const newSocketIds = disconnectingUser.socketIds.filter(id => id !== socketId);
    disconnectingUser.socketIds = newSocketIds;
    newActiveUsers[userIndex] = disconnectingUser;

    if(disconnectingUser.socketIds.length === 0) {
      newActiveUsers = activeUsers.filter(user => user.userId !== disconnectingUser.userId);
    }

    activeUsers = newActiveUsers;
    return newActiveUsers;
  }
  return activeUsers;
};


const IO = io(server, {
  cors: {
    origin: "*"
  }
});

IO.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("addActiveUser", ({userId}) => {
    const newActiveUsers = addActiveUser(userId, socket.id);
    IO.emit("getActiveUsers", {activeUsers: newActiveUsers});
  });

  socket.on("sendMessage", ({
    userId,
    chatId,
    newLastMessage,
    message
  }) => {
    const user = activeUsers.find(user => user.userId.toString() === userId.toString());
    if(user) {
      user.socketIds.forEach(socketId => {
        socket.to(socketId).emit("receiveMessage", {userId, chatId, newLastMessage, message});
      });
    }
  });

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
        }
      }
    });
  });

  socket.on("sendSingleNotification", ({notification}) => {
    const user = activeUsers.find(user => user.userId.toString() === notification.user.toString());
    
    if(user) {
      user.socketIds.forEach(socketId => {
        socket.to(socketId).emit("receiveNotification", {notification});
      });
    }
  });

  socket.on("sendFriendRequest", ({notification, user}) => {
    const userExists = activeUsers.find(user => user.userId.toString() === notification.user.toString());
    
    if(userExists) {
      userExists.socketIds.forEach(socketId => {
        socket.to(socketId).emit("receiveFriendRequest", {notification, user});
      });
    }
  });
  
  socket.on("unsendFriendRequest", ({authUserId, targetUserId}) => {
    const user = activeUsers.find(user => user.userId.toString() === targetUserId);

    if(user) {
      user.socketIds.forEach(socketId => {
        socket.to(socketId).emit("friendRequestWithdrawn", {userId: authUserId});
      });
      
    }
  });

  socket.on("acceptFriendRequest", ({notification, user}) => {
    const userExists = activeUsers.find(user => user.userId.toString() === notification.user.toString());

    if(userExists) {
      userExists.socketIds.forEach(socketId => {
        socket.to(socketId).emit("friendRequestAccepted", {notification, user});
      });
      
    }
  });

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
    // const newActiveUsers = await removeActiveUser(socket.id);
    const newActiveUsers = activeUsers.filter(user => user.userId !== disconnectingUser.userId);
    activeUsers = [...newActiveUsers];
    
    IO.emit("getActiveUsers", {activeUsers: newActiveUsers});
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("disconnect", async() => {
    console.log("User disconnected");
    const newActiveUsers = await removeActiveUser(socket.id);
    IO.emit("getActiveUsers", {activeUsers: newActiveUsers});
  });
});


mongoose.set("strictQuery", false);
mongoose.connect(DB)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    });
  })
  .catch(err => {
    console.log(err)
  });
