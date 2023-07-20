const { Schema, model } = require("mongoose");

const PhotoAlbumSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  albumName: {
    type: String,
    require: [true, "Album Name is required"]
  },
  photos: [
    {
      photo: {
        secure_url: String,
        public_id: String
      },
      description: String,
      likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }],
      taggs: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

const PhotoAlbum = model("PhotoAlbum", PhotoAlbumSchema);

module.exports = PhotoAlbum;