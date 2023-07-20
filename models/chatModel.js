const { Schema, model } = require("mongoose");

const ChatSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  chatCreator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  unreadMessages: [{
    user: Schema.Types.ObjectId,
    messages: [Schema.Types.ObjectId]
  }],
  lastMessage: {
    originalMessageId: Schema.Types.ObjectId,
    text: String,
    hasPhoto: Boolean,
    sender: Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ["delivered", "seen"]
    },
    time: Date
  },
  chatEmpty: {
    type: Boolean,
    default: true
  },
  chatDeletedFor: [Schema.Types.ObjectId]
}, { timestamps: true });

const Chat = model("Chat", ChatSchema);

module.exports = Chat;