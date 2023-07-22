const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cloudinary = require("cloudinary").v2;
const cloudinaryConfig = require("../utils/cloudinaryConfig");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require( "../models/userModel" );

cloudinary.config(cloudinaryConfig);

exports.sendModalMessage = catchAsync(async(req, res, next) => {
  const { userId, messageText } = req.fields;
  const messagePhoto = req.files.messagePhoto;

  if((!messageText || (messageText && messageText.trim().length === 0)) && !messagePhoto) return next(new AppError("Cannot send empty message", 400));

  let targetChat = await Chat.findOne({
    $and: [
      {users: {$in: req.user._id}},
      {users: {$in: userId}}
    ]
  });

  if(!targetChat) {
    targetChat = await Chat.create({
      users: [req.user._id, userId],
      chatCreator: req.user._id,
      unreadMessages: [
        {user: req.user._id, messages: []},
        {user: userId, messages: []}
      ],
      chatEmpty: false
    });
  }

  const newMessage = await Message.create({
    chatId: targetChat._id,
    sender: req.user._id,
    receiver: userId,
    text: messageText
  });

  targetChat.lastMessage = {
    originalMessageId: newMessage._id,
    text: messageText,
    sender: req.user._id,
    status: "delivered",
    time: Date.now()
  };

  if(messagePhoto) {
    const result = await cloudinary.uploader.upload(messagePhoto.path);
    if(result) {
      newMessage.photo = {
        secure_url: result.secure_url,
        public_id: result.public_id
      };

      targetChat.lastMessage.hasPhoto = true;
      newMessage.photo = {
        secure_url: result.secure_url,
        public_id: result.public_id
      };

      await newMessage.save();
    }
  }

  const receiverUnreadMsgsIndex = targetChat.unreadMessages.findIndex(item => item.user.toString() === userId);
  targetChat.unreadMessages[receiverUnreadMsgsIndex].messages.push(newMessage._id);

  await targetChat.save();

  const populatedMessage = await newMessage.populate([
    {
      path: "sender",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    },{
      path: "receiver",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }
  ]);

  res.status(200).json({
    status: "success",
    chatId: targetChat._id,
    newMessage: populatedMessage,
    newLastMessage: targetChat.lastMessage
  });
});

exports.sendMessage = catchAsync(async(req, res, next) => {
  const { chatId, messageText, userId } = req.fields;
  
  const messagePhoto = req.files.messagePhoto;

  if(!messagePhoto && messageText.trim().length === 0) return next(new AppError("Cannot send empty message", 400));

  const chat = await Chat.findById(chatId);
  if(!chat) return next(new AppError("Can't find chat. Try refreshing the page", 404));

  const newMessage = await Message.create({
    chatId,
    sender: req.user._id,
    receiver: userId,
    text: messageText
  });

  chat.lastMessage = {
    originalMessageId: newMessage._id,
    text: messageText,
    sender: req.user._id,
    status: "delivered",
    time: Date.now()
  };

  if(messagePhoto) {
    const result = await cloudinary.uploader.upload(messagePhoto.path);
    if(result) {
      newMessage.photo = {
        secure_url: result.secure_url,
        public_id: result.public_id
      };

      chat.lastMessage.hasPhoto = true;
      newMessage.photo = {
        secure_url: result.secure_url,
        public_id: result.public_id
      };

      await newMessage.save();
    }
  }

  const receiverUnreadMsgsIndex = chat.unreadMessages.findIndex(item => item.user.toString() === userId);
  chat.unreadMessages[receiverUnreadMsgsIndex].messages.push(newMessage._id);

  await chat.save();

  const populatedMessage = await newMessage.populate([
    {
      path: "sender",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    },{
      path: "receiver",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }
  ]);

  res.status(200).json({
    status: "success",
    newMessage: populatedMessage,
    newLastMessage: chat.lastMessage
  });
});

exports.editMessage = catchAsync(async(req, res, next) => {

});

exports.deleteMessage = catchAsync(async(req, res, next) => {

});

exports.markMessagesAsSeen = catchAsync(async(req, res, next) => {  
  const { messageIds, chatId } = req.body;

  if(!messageIds) return next();

  const parsedMessageIds = JSON.parse(messageIds);
  if(parsedMessageIds.length === 0) return next();

  await Message.updateMany({_id: {$in: parsedMessageIds}}, {status: "seen"});

  const chat = await Chat.findById(chatId);

  const myUnreadMsgsIndex = chat.unreadMessages.findIndex(msgs => msgs.user.toString() === req.user._id.toString());

  let newUnreadMsgsList = chat.unreadMessages[myUnreadMsgsIndex].messages.filter(msg => !parsedMessageIds.includes(msg.toString()));

  chat.unreadMessages[myUnreadMsgsIndex].messages = newUnreadMsgsList;

  let hasLastMsg = false;
  if(parsedMessageIds.includes(chat.lastMessage.originalMessageId.toString()) && chat.lastMessage.sender.toString() !== req.user._id.toString()) {
    chat.lastMessage.status = "seen";
    hasLastMsg = true;
  }

  await chat.save();

  res.status(200).json({
    status: "success",
    userId: req.user._id,
    newUnreadMsgsList,
    hasLastMsg
  });
});

exports.getUnreadChatsCount = catchAsync(async(req, res, next) => {
  const unreadChatsCount = await Chat.find({
    $and: [
      {"lastMessage.status": "delivered"}, {users: {$in: req.user._id}}, {"lastMessage.sender": {$ne: req.user._id}}
    ]
  }).count();

  res.status(200).json({
    status: "success",
    unreadChatsCount
  });
});

exports.getChats = catchAsync(async(req, res, next) => {
  const chats = await Chat.find({users: {$in: req.user._id}}).populate("users", "_id fullName profilePhotoUrl active blockList");

  const filteredChats = chats.filter(chat => {
    const user = chat.users.find(user => user._id.toString() !== req.user._id.toString());
    
    if(!user.blockList.includes(req.user._id) && user.active === true) return chat;
  }).map(chat => ({
    ...chat.toObject(),
    users: chat.users.map(user => ({_id: user._id, fullName: user.fullName, profilePhotoUrl: user.profilePhotoUrl}))
  }));

  res.status(200).json({
    status: "success",
    chats: filteredChats
  });
});

exports.getSingleChatMessages = catchAsync(async(req, res, next) => {
  const { chatId, userId } = req.params;

  const messages = await Message.find({chatId}).populate("sender", "_id fullName profilePhotoUrl").populate("receiver", "_id fullName profilePhotoUrl");

  const user = await User.findById(userId).select("+_id fullName profilePhotoUrl lastTimeSeen");

  const chat = await Chat.findById(chatId);
  const myUnreadMessages = chat.unreadMessages.find(msgs => msgs.user.toString() === req.user._id.toString());

  res.status(200).json({
    status: "success",
    chatId,
    messages,
    user,
    unreadMessages: myUnreadMessages.messages
  });
});