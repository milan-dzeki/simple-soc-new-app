const catchAsync = require("../utils/catchAsync");
const ActivityLog = require("../models/activityLogModel");

exports.getActivityLogsForUser = catchAsync(async(req, res, next) => {
  const acitvityLogs = await ActivityLog.find({user: req.user._id}).populate("targetUser", "_id fullName");

  res.status(200).json({
    status: "success",
    acitvityLogs
  });
});

exports.deleteLog = catchAsync(async(req, res, next) => {
  const { logId } = req.params;

  await ActivityLog.findOneAndDelete({_id: logId, user: req.user._id});

  res.status(204).json({
    status: "success"
  });
});

