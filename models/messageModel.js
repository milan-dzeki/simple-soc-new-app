const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat"
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,
  photo: {
    secure_url: String,
    public_id: String
  },
  edited: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["delivered", "seen"],
    default: "delivered"
  }
}, { timestamps: true });

const Message = model("Message", MessageSchema);

module.exports = Message;