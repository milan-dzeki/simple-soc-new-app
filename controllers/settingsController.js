const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Settings = require("../models/settingsModel");
const User = require("../models/userModel");

exports.createSettingsForAll = catchAsync(async(req, res, next) => {
  const allUsers = await User.find();

  for(const user of allUsers) {
    const setting = await Settings.findOne({user: user._id});
    if(!setting) {
      await Settings.create({
        user: user._id,
        profileAccess: {
          whoCanSeeMyPosts: "everyone",
          whoCanSeeMyPhotos: "everyone",
          whoCanSeeMyFriendsList: "everyone",
          whoCanSeeMyProfileInfo: "everyone",
        },
        messaging: {
          whoCanMessageMe: "everyone",
        },
        commentingAndLiking: {
          whoCanLikeMyPosts: "everyone",
          whoCanCommentMyPosts: "everyone",
          whoCanLikeMyPhotos: "everyone",
          whoCanCommentMyPhotos: "everyone",
        },
        friendRequests: {
          whoCanAddMe: "everyone",
        }
      });
    }
  }

  res.status(200).json("created")
});

exports.getMySettings = catchAsync(async(req, res, next) => {
  const settings = await Settings.findOne({user: req.user._id}).select("-_id -user -__v");
  if(!settings) return next(new AppError("Cannot access settngs. try refreshing the page", 404));

  res.status(200).json({
    status: "success",
    settings
  });
});

exports.changeSingleSetting = catchAsync(async(req, res, next) => {
  const { settingGroup, settingName, settingValue } = req.body;

  const settings = await Settings.findOne({user: req.user._id});
  if(!settings) return next(new AppError("Cannot seem to find your settings data. Try refreshing the page.", 404));

  settings[settingGroup][settingName] = settingValue;
  await settings.save();

  res.status(200).json({
    status: "success"
  });
});