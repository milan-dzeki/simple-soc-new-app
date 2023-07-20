const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,
  photos: [
    {
      albumId: Schema.Types.ObjectId,
      photo: {
        secure_url: String,
        public_id: String
      },
      decription: String,
      taggs: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }]
    }
  ],
  taggs: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
}, { timestamps: true });

const Post = model("Post", PostSchema);

module.exports = Post;