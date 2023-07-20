const { Schema, model } = require("mongoose");

const ActivityLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  action: {
    type: String,
    enum: ["sentFriendRequest", "unsendFriendRequest", "acceptFriendRequest", "declineFriendRequest", "unfriendUser", "searchUser", "blockUser", "unblockUser", "createPost", "editPost", "deletePost", "createAlbum", "deleteAlbum", "addPhotoToAlbum", "deletePhotoFromAlbum", "likePost", "unlikePost", "commentPost", "editCommentOnPost", "deleteCommentFromPost", "likePostComment", "unlikePostComment", "likePhoto", "unlikePhoto", "commentPhoto", "deleteCommentFromPhoto", "likePhotoComment", "unlikePhotoComment"]
  },
  targetUser: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  logText: String,
  albumId: Schema.Types.ObjectId,
  photoId: Schema.Types.ObjectId,
  postId: Schema.Types.ObjectId,
  commentId: Schema.Types.ObjectId
}, { timestamps: true });

const ActivityLog = model("ActivityLog", ActivityLogSchema);

module.exports = ActivityLog;