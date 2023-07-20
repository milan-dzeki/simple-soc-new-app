const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  notificationType: {
    type: String,
    enum: ["receivedFriendRequest", "acceptedFriendRequest", "userLikedYourPost", "userCommentedOnYourPost", "userPostedOnYourWall", "userTaggedYouInPost", "userTaggedYouInCommentOnPost", "userTaggedYouInCommentOnPhoto", "userLikedYourCommentOnPost", "userLikedYourCommentOnPhoto", "userLikedYourPhoto", "userCommentedOnYourPhoto", "userTaggedYouInPhoto"]
  },
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread"
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  albumId: String,
  photoId: String,
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
}, { timestamps: true });

const Notification = model("Notification", NotificationSchema);

module.exports = Notification;