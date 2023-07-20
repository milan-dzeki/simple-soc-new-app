const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Profile = require("../models/profileModel");
const Friends = require("../models/friendsModel");
const findMutualFriends = require("../utils/findMutualFriends");

exports.getMyProfile = catchAsync(async(req, res, next) => {
  const profile = await Profile.findOne({user: req.user._id}).select("-__v -user -_id");
  if(!profile) return next(new AppError("No profile found. Try refreshing the page", 404));

  res.status(200).json({
    status: "success", 
    profile
  });
});

exports.getUsersProfile = catchAsync(async(req, res, next) => {
  const { userId, whoCanSeeMyProfileInfo } = req.params;

  let profile = {};
  let sendProfile = true;
  if(whoCanSeeMyProfileInfo === "none") {
    sendProfile = false;
  } else if(whoCanSeeMyProfileInfo === "friends") {
    const myFriendList = await Friends.findOne({user: req.user._id});
    const amIFriend = myFriendList.friends.find(u => u.toString() === userId);
    if(!amIFriend) {
      sendProfile = false;
    }
  } else if(whoCanSeeMyProfileInfo === "friendsOfFriends") {
    const myFriendList = await Friends.findOne({user: req.user._id});
    const usersFriendsList = await Friends.findOne({user: userId});
    const mutuals = findMutualFriends(myFriendList.friends, usersFriendsList.friends);
    if(mutuals.length === 0) {
      sendProfile = false;
    }
  } else if(whoCanSeeMyProfileInfo === "everyone") {
    sendProfile = true;
  }

  if(sendProfile) {
    profile = await Profile.findOne({user: userId}).select("-__v -user -_id");
  }

  res.status(200).json({
    status: "success",
    profile
  });
});

exports.addCurrentResidenceInfo = catchAsync(async(req, res, next) => {
  const { country, state, city, from } = req.body;

  if(!country) return next(new AppError("Country is the only field required. You cannot add State or City without the country", 400));

  await Profile.findOneAndUpdate({user: req.user._id}, {
    currentResidence: {
      country, state, city, from
    }
  });

  res.status(200).json({
    status: "success"
  });
});

exports.deleteCurrentResidenceInfo = catchAsync(async(req, res, next) => {
  await Profile.findOneAndUpdate({user: req.user._id}, {currentResidence: {}});

  res.status(204).json({
    status: "success"
  });
});

exports.addNewPreviousResidenceInfo = catchAsync(async(req, res, next) => {
  const { 
    country,
    state,
    city,
    from,
    to
  } = req.body;
  if(!country) return next(new AppError("Country is required", 400));

  const newPrevResidence = {
    country, state: state || "", city: city || "", from: from || "", to: to || ""
  };

  const profile = await Profile.findOne({user: req.user._id});
  profile.previousResidences.push(newPrevResidence);

  await profile.save();

  res.status(200).json({
    status: "success",
    previousResidences: profile.previousResidences
  });
});

exports.editSinglePreviousResidenceInfo = catchAsync(async(req, res, next) => {
  const { 
    id,
    country,
    state,
    city,
    from,
    to
  } = req.body;

  if(!id) return next(new AppError("Residce not found. Try refreshing the page", 404));
  if(!country) return next(new AppError("Country is required", 400));

  const profile = await Profile.findOne({user: req.user._id});
  const indexOfPrevRes = profile.previousResidences.findIndex(resid => resid._id.toString() === id);
  if(indexOfPrevRes === -1) return next(new AppError("Residce not found. Try refreshing the page", 404));

  profile.previousResidences[indexOfPrevRes] = {
    _id: id,
    country,
    state: state || "",
    city: city || "",
    from: from || "",
    to: to || ""
  };

  await profile.save();

  res.status(200).json({
    status: "success",
    editedResidence: profile.previousResidences[indexOfPrevRes]
  });
});

exports.deleteSinglePreviousResidenceInfo = catchAsync(async(req, res, next) => {
  const { id } = req.params;

  const profile = await Profile.findOne({user: req.user._id});
  const newPrevResidences = profile.previousResidences.filter(resid => resid._id.toString() !== id);
  profile.previousResidences = newPrevResidences;
  await profile.save();

  res.status(204).json({
    status: "success"
  });
});

exports.addHighSchoolInfo = catchAsync(async(req, res, next) => {
  const {
    name,
    country,
    state,
    city,
    status,
    graduateDate
  } = req.body;
  console.log(graduateDate);

  if(!name || (name && name.trim().length === 0)) return next(new AppError("School name is required", 400));
  if(!status || (status && status.toLowerCase() !== "studying" && status.toLowerCase() !== "finished")) return next(new AppError("Status is required and must be either 'studying' or 'finished'", 400));
  const profile = await Profile.findOne({user: req.user._id});
  profile.highSchool = {
    name,
    country: country || "",
    state: state || "",
    city: city || "",
    graduateDate: graduateDate || "",
    status: status || "finished"
  };

  await profile.save();
  console.log(profile);

  res.status(200).json({
    status: "success"
  });
});

exports.deleteHighSchoolInfo = catchAsync(async(req, res, next) => {
  const profile = await Profile.findOne({user: req.user._id});
  profile.highSchool = {};
  await profile.save();

  res.status(204).json({
    status: "success"
  });
});

exports.addNewCurrentJobInfo = catchAsync(async(req, res, next) => {
  const {
    role,
    company,
    country,
    state,
    city,
    from
  } = req.body;

  if(!role || (role && role.trim().length === 0)) return next(new AppError("Role is required", 400));

  const profile = await Profile.findOne({user: req.user._id});

  const newJob = {
    role,
    company: company || "",
    country: country || "",
    state: state || "",
    city: city || "",
    from: from || ""
  };
  profile.jobs.push(newJob);

  await profile.save();

  res.status(201).json({
    status: "success",
    jobs: profile.jobs
  });
});

exports.editSingleCurrentJobInfo = catchAsync(async(req, res, next) => {
  const {
    id,
    role,
    company,
    country,
    state,
    city,
    from
  } = req.body;

  if(!role || (role && role.trim().length === 0)) return next(new AppError("Role is required", 400));

  const profile = await Profile.findOne({user: req.user._id});

  const jobIndex = profile.jobs.findIndex(job => job._id.toString() === id);
  if(jobIndex === -1) return next(new AppError("Job not found. Try refreshing the page", 404));

  profile.jobs[jobIndex] = {
    _id: id,
    role,
    company: company || "",
    country: country || "",
    state: state || "",
    city: city || "",
    from: from || ""
  };

  await profile.save();

  res.status(200).json({
    status: "success",
    editedJob: profile.jobs[jobIndex]
  });
});

exports.deleteSingleCurrentJobInfo = catchAsync(async(req, res, next) => {
  const { id } = req.params;

  const profile = await Profile.findOne({user: req.user._id});
  const newCurrentJobs = profile.jobs.filter(job => job._id.toString() !== id);
  profile.jobs = newCurrentJobs;

  await profile.save();

  res.status(204).json({ status: "success" });
});

exports.addNewPreviousJobInfo = catchAsync(async(req, res, next) => {
  const {
    role,
    company,
    country,
    state,
    city,
    from,
    to
  } = req.body;

  if(!role || (role && role.trim().length === 0)) return next(new AppError("Role is required", 400));

  const profile = await Profile.findOne({user: req.user._id});

  const newPrevJob = {
    role,
    company: company || "",
    country: country || "",
    state: state || "",
    city: city || "",
    from: from || "",
    to: to || ""
  };
  profile.previousJobs.push(newPrevJob);

  await profile.save();

  res.status(201).json({
    status: "success",
    previousJobs: profile.previousJobs
  });
});

exports.editSinglePreviousJobInfo = catchAsync(async(req, res, next) => {
  const {
    id,
    role,
    company,
    country,
    state,
    city,
    from,
    to
  } = req.body;

  if(!role || (role && role.trim().length === 0)) return next(new AppError("Role is required", 400));

  const profile = await Profile.findOne({user: req.user._id});

  const prevJobIndex = profile.previousJobs.findIndex(job => job._id.toString() === id);
  if(prevJobIndex === -1) return next(new AppError("Job not found. Try refreshing the page", 404));

  profile.previousJobs[prevJobIndex] = {
    _id: id,
    role,
    company: company || "",
    country: country || "",
    state: state || "",
    city: city || "",
    from: from || "",
    to: to || ""
  };

  await profile.save();

  res.status(200).json({
    status: "success",
    editedJob: profile.previousJobs[prevJobIndex]
  });
});

exports.deleteSinglePreviousJobInfo = catchAsync(async(req, res, next) => {
  const { id } = req.params;

  const profile = await Profile.findOne({user: req.user._id});
  const newPreviousJobs = profile.previousJobs.filter(job => job._id.toString() !== id);
  profile.previousJobs = newPreviousJobs;

  await profile.save();

  res.status(204).json({ status: "success" });
});

exports.addNewCollegeOrEducationInfo = catchAsync(async(req, res, next) => {
  const { infoType } = req.params;
  const {
    name,
    country,
    state,
    city,
    status,
    graduateDate
  } = req.body;

  if(!infoType || (infoType && infoType.toLowerCase() !== "colleges" && infoType !== "educationOther")) return next(new AppError("Info type can only be 'colleges' or 'educationOther'", 400));
  if(!name || (name && name.trim().length === 0)) return next(new AppError("School name is required", 400));
  if(!status || (status && status.toLowerCase() !== "studying" && status.toLowerCase() !== "finished")) return next(new AppError("Status is required and must be either 'studying' or 'finished'", 400));

  const profile = await Profile.findOne({user: req.user._id});
  const newInfo = {
    name,
    country: country || "",
    state: state || "",
    city: city || "",
    status,
    graduateDate: status === "finished" && graduateDate ? graduateDate : ""
  };

  profile[infoType].push(newInfo);

  await profile.save();

  let resData = profile.colleges;

  if(infoType === "educationOther") {
    resData = profile.educationOther;
  }

  res.status(201).json({
    status: "success",
    info: resData
  });
});

exports.editSingleCollegeOrEducationInfo = catchAsync(async(req, res, next) => {
  const { infoType } = req.params;
  const {
    id,
    name,
    country,
    state,
    city,
    status,
    graduateDate
  } = req.body;

  if(!infoType || (infoType && infoType.toLowerCase() !== "colleges" && infoType !== "educationOther")) return next(new AppError("Info type can only be 'colleges' or 'educationOther'", 400));
  if(!name || (name && name.trim().length === 0)) return next(new AppError("School name is required", 400));
  if(!status || (status && (status.toLowerCase() !== "studying" && status.toLowerCase() !== "finished"))) return next(new AppError("Status is required and must be either 'studying' or 'finished'", 400));

  const profile = await Profile.findOne({user: req.user._id});

  const infoIndex = profile[infoType].findIndex(info => info._id.toString() === id);
  if(infoIndex === -1) return next(new AppError("Info not found. Try refreshing the page", 404));

  profile[infoType][infoIndex] = {
    _id: id,
    name,
    country: country || "",
    state: state || "",
    city: city || "",
    status,
    graduateDate: graduateDate || ""
  };

  await profile.save();

  res.status(200).json({
    status: "success",
    editedItem: profile[infoType][infoIndex]
  });
});

exports.deleteSingleCollegeOrEducationInfo = catchAsync(async(req, res, next) => {
  const { infoType, id } = req.params;
  if(!infoType || (infoType && (infoType.toLowerCase() !== "colleges" || infoType !== "educationOther"))) return next(new AppError("Info type can only be 'colleges' or 'educationOther'", 400));

  const profile = await Profile.findOne({user: req.user._id});
  const newInfo = profile[infoType].filter(info => info._id.toString() !== id);
  profile[infoType] = newInfo;

  await profile.save();

  res.status(204).json({
    status: "success"
  });
});