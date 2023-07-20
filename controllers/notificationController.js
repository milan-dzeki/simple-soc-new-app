const catchAsync = require("../utils/catchAsync");
const Notification = require("../models/notificationModel");

exports.getUnreadNotificationsCount = catchAsync(async(req, res, next) => {
  const unreadNotificationsCount = await Notification.find({user: req.user._id, status: "unread"}).count();

  res.status(200).json({
    status: "success",
    unreadNotificationsCount
  });
});

exports.getNotifications = catchAsync(async(req, res, next) => {
  const notifications = await Notification.find({user: req.user._id}).populate("fromUser", "_id fullName profilePhotoUrl").sort("-createdAt").select("-__v");

  res.status(200).json({
    status: "success",
    notifications
  });
});

exports.markNotificationAsRead = catchAsync(async(req, res, next) => {
  const { notificationId } = req.body;

  await Notification.findByIdAndUpdate(notificationId, {status: "read"});

  res.status(200).json({
    status: "success"
  });
});

exports.markNotificationAsUnread = catchAsync(async(req, res, next) => {
  const { notificationId } = req.body;

  await Notification.findByIdAndUpdate(notificationId, {status: "unread"});

  res.status(200).json({
    status: "success"
  });
});

exports.deleteNotification = catchAsync(async(req, res, next) => {
  const { notificationId } = req.params;

  await Notification.findByIdAndDelete(notificationId);

  res.status(204).json({ status: "success" });
});
