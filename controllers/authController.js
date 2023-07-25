const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const cloudinary = require("cloudinary").v2;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const authFormatUser = require("../utils/authFormatUser");
const cloudinaryConfig = require("../utils/cloudinaryConfig");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Friends = require("../models/friendsModel");
const Settings = require("../models/settingsModel");
const ActivityLog = require( "../models/activityLogModel" );
const PhotoAlbum = require("../models/photoAlbumModel");
const Chat = require("../models/chatModel");
const Comment = require("../models/commentModel");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");
const Post = require("../models/postModel");
const months = require("../utils/months");

cloudinary.config(cloudinaryConfig);

exports.signup = catchAsync(async(req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    birthDay,
    birthMonth,
    birthYear,
    gender
  } = req.fields;

  if(!password || (password && password.length < 6)) return next(new AppError("Password witn at least 6 characters is required", 400));
  if(!passwordConfirm) return next(new AppError("Password confirmation is required", 400));
  if(password !== passwordConfirm) return next(new AppError("Passwords must be the same", 400));
  if(!firstName || !lastName) return next(new AppError("First and Last names are required", 400));
  if(firstName.split(" ").length >  1 || lastName.split(" ").length > 1) return next(new AppError("First Name and Last Name must be single words", 400)); 

  const hashedPassword = await bcrypt.hash(password, 10);

  let dateOfBirth = "";
  if(birthDay && birthMonth && birthYear) {
    const monthNum = months.findIndex(m => m === birthMonth.toLowerCase());
    if(monthNum !== -1) {
      dateOfBirth = `${birthDay}.${monthNum + 1}.${birthYear}`;
    }
  }

  const prepareUser = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    dateOfBirth,
    gender,
    profilePhotoUrl: "",
    profilePhotoPublicId: "",
    blockList: [],
    blockedMe: []
  };

  const profilePhoto = req.files.photo;
  if(profilePhoto) {
    const photoRes = await cloudinary.uploader.upload(profilePhoto.path);
    if(photoRes) {
      prepareUser.profilePhotoUrl = photoRes.secure_url;
      prepareUser.profilePhotoPublicId = photoRes.public_id;
    }
  }

  const user = await User.create(prepareUser);
  await Profile.create({user: user._id});
  await Friends.create({user: user._id});
  await Settings.create({user: user._id});

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  const sendUser = authFormatUser(user);

  res.status(201).json({
    status: "success",
    token,
    user: sendUser
  });
});

exports.login = catchAsync(async(req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if(!email || !password) return next(new AppError("Email and password are required", 400));
  if(!validator.isEmail(email)) return next(new AppError("Valid email format is required", 400));

  const user = await User.findOne({email}).select("+password").populate("blockList", "_id fullName profilePhotoUrl");
  if(!user) return next(new AppError("Invalid email or password", 400));

  const doesPasswordMatch = await bcrypt.compare(password, user.password);
  if(!doesPasswordMatch) return next(new AppError("Invalid email or password", 400));
  
  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  user.active = true;
  await user.save();
  const sendUser = authFormatUser(user);

  res.status(200).json({
    status: "success",
    token,
    user: sendUser
  });
});

exports.isLoggedIn = async(req, res, next) => {
  const { token } = req.body;

  try {
    if(!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).populate("blockList", "_id fullName profilePhotoUrl");

    if(!user) return next();
    
    const sendUser = authFormatUser(user);

    res.status(200).json({
      status: "success",
      token,
      user: sendUser
    });
  } catch(error) {
    return next();
  }
};

exports.deleteAccount = catchAsync(async(req, res, next) => {
  const me = await User.findById(req.user._id);

  await ActivityLog.deleteMany({user: req.user._id});

  const friends = await Friends.findOne({user: req.user._id});
  console.log(friends);

  if(friends.friends.length > 0) {
    for(const friend of friends.friends) {
      const friendsFriends = await Friends.findOne({user: friend});
      console.log(friendsFriends);
      if(friendsFriends) {
        const newFriendList = friendsFriends.friends.filter(fr => fr.toString() !== req.user._id.toString());
        friendsFriends.friends = newFriendList;
        await friendsFriends.save();
      }
    }
  }
  if(friends.sentPendingRequests.length > 0) {
    for(const friend of friends.sentPendingRequests) {
      const friendsFriends = await Friends.findOne({user: friend});
      if(friendsFriends) {
        const newFriendList = friendsFriends.sentPendingRequests.filter(fr => fr.toString() !== req.user._id.toString());
        friendsFriends.sentPendingRequests = newFriendList;
        await friendsFriends.save();
      }
    }
  }
  if(friends.receivedPendingRequests.length > 0) {
    for(const friend of friends.receivedPendingRequests) {
      const friendsFriends = await Friends.findOne({user: friend});
      if(friendsFriends) {
        const newFriendList = friendsFriends.receivedPendingRequests.filter(fr => fr.toString() !== req.user._id.toString());
        friendsFriends.receivedPendingRequests = newFriendList;
        await friendsFriends.save();
      }
    }
  }
  
  const myComments = await Comment.find({commentator: req.user._id});
  const commentIds = myComments.map(comment => comment._id);
  const postIds = [];
  myComments.forEach(comment => {
    if(comment.postId) {
      postIds.push(comment.postId);
    }
  });

  const postWhereUserCommentedOrLiked = await Post.find({
    $or: [
      {
        _id: {$in: postIds}
      },
      {
        likes: {$in: req.user._id}
      },
      {
        taggs: {$in: req.user._id}
      }
    ]
  });

  for(const post of postWhereUserCommentedOrLiked) {
    const newComments = post.comments.filter(comment => !commentIds.includes(comment.toString()));
    const newLikes = post.likes.filter(like => like.toString() !== req.user._id.toString());
    const newTaggs = post.taggs.filter(tagg => tagg.toString() !== req.user._id.toString());

    post.comments = newComments;
    post.likes = newLikes;
    post.taggs = newTaggs;
    await post.save();
  }
  
  const photoIds = [];
  myComments.forEach(comment => {
    if(comment.photoId) {
      photoIds.push(comment.photoId);
    }
  });

  const photoAlbumsWhereUserCommentedOrLiked = await PhotoAlbum.find({
    $or: [
      {"photos._id": {$in: photoIds}},
      {"photos.likes": {$in: req.user._id}},
      {"photos.taggs": {$in:req.user._id}}
    ]
  });
  
  for(const album of photoAlbumsWhereUserCommentedOrLiked) {
    const newPhotos = album.photos.map(photo => {
      const newComments = photo.comments.filter(comment => !commentIds.includes(comment.toString()));
      const newLikes = photo.likes.filter(like => like.toString() !== req.user._id.toString());
      const newTaggs = photo.taggs.filter(tagg => tagg.toString() !== req.user._id.toString());

      return {
        ...photo.toObject(),
        comments: newComments,
        likes: newLikes,
        taggs: newTaggs
      };
    });

    album.photos = newPhotos;
    await album.save();
  }

  

  const photoAlbums = await PhotoAlbum.find({user: req.user._id});

  if(photoAlbums.length > 0) {
    for(const album of photoAlbums) {
      if(album.photos.length > 0) {
        for(const photo of album.photos) {
          await cloudinary.uploader.destroy(photo.photo.public_id);
        }
      }
    }
  }

  const myPosts = await Post.find({user: req.user._id});

  const myPostIds = myPosts.map(post => post._id);

  const usersThatBlockedMe = await User.find({blockList: {$in: req.user._id}});
  if(usersThatBlockedMe.length > 0) {
    for(const user of usersThatBlockedMe) {
      const newBlockList = user.blockList.filter(user => user.toString() !== req.user._id);
      user.blockList = newBlockList;
      await user.save();
    }
  }

  await Friends.deleteOne({user: req.user._id});
  await PhotoAlbum.deleteMany({user: req.user._id});
  await Profile.deleteOne({user: req.user._id});
  await Settings.deleteOne({user: req.user._id});
  await Comment.deleteMany({
    $or: [
      {commentator: req.user._id},
      {postId: {$in: myPostIds}}
    ]
  });
  await Post.deleteMany({user: req.user._id});
  await Notification.deleteMany({
    $or: [
      {user: req.user._id},
      {fromUser: req.user._id}
    ]
  });
  await Chat.deleteMany({users: {$in: req.user._id}});
  await Message.deleteMany({
    $or: [
      {
        sender: req.user._id
      },
      {
        receiver: req.user._id
      }
    ]
  });
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json("OK");
});

