const { Schema, model } = require("mongoose");

const SettingsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  profileAccess: {
    whoCanSeeMyPosts: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends", "none"],
      default: "everyone"
    },
    whoCanSeeMyPhotos: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends", "none"],
      default: "everyone"
    },
    whoCanSeeMyFriendsList: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends", "none"],
      default: "everyone"
    },
    whoCanSeeMyProfileInfo: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends", "none"],
      default: "everyone"
    }
  },
  messaging: {
    whoCanMessageMe: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends"],
      default: "everyone"
    },
  },
  commentingAndLiking: {
    whoCanLikeMyPosts: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends", "none"],
      default: "everyone"
    },
    whoCanCommentMyPosts: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends", "none"],
      default: "everyone"
    },
    whoCanLikeMyPhotos: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends", "none"],
      default: "everyone"
    },
    whoCanCommentMyPhotos: {
      type: String,
      enum: ["everyone", "friends", "friendsOfFriends", "none"],
      default: "everyone"
    }
  },
  friendRequests: {
    whoCanAddMe: {
      type: String,
      enum: ["everyone", "friendsOfFriends", "none"],
      default: "everyone"
    }
  }
});

// const SettingsSchema = new Schema({
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User"
//   },
  // whoCanAddMe: {
  //   type: String,
  //   enum: ["everyone", "friendsOfFriends", "none"],
  //   default: "everyone"
  // },
  // whoCanSeeMyProfileInfo: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends", "none"],
  //   default: "everyone"
  // },
  // whoCanSeeMyPhotos: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends", "none"],
  //   default: "everyone"
  // },
  // whoCanSeeMyPosts: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends", "none"],
  //   default: "everyone"
  // },
  // whoCanSeeMyFriendsList: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends", "none"],
  //   default: "everyone"
  // },
  // whoCanMessageMe: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends"],
  //   default: "everyone"
  // },
  // whoCanLikeMyPosts: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends", "none"],
  //   default: "everyone"
  // },
  // whoCanCommentMyPosts: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends", "none"],
  //   default: "everyone"
  // },
  // whoCanLikeMyPhotos: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends", "none"],
  //   default: "everyone"
  // },
  // whoCanCommentMyPhotos: {
  //   type: String,
  //   enum: ["everyone", "friends", "friendsOfFriends", "none"],
  //   default: "everyone"
  // }
// });

const Settings = model("Settings", SettingsSchema);

module.exports = Settings;