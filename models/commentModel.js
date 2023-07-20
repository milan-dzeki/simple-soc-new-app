const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
  photoId: Schema.Types.ObjectId,
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  commentator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,
  photo: {
    secure_url: String,
    public_id: String
  },
  taggs: [{
    userId: Schema.Types.ObjectId,
    userFullName: String
  }],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

const Comment = model("Comment", CommentSchema);

module.exports = Comment;