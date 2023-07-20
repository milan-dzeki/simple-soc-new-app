const cloudinary = require("cloudinary").v2;
const cloudinaryConfig = require("../utils/cloudinaryConfig");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const PhotoAlbum = require("../models/photoAlbumModel");
const Comment = require("../models/commentModel");
const Notification = require("../models/notificationModel");

cloudinary.config(cloudinaryConfig);

exports.getMyPhotoAlbums = catchAsync(async(req, res, next) => {
  const photoAlbums = await PhotoAlbum.find({user: req.user._id}).select("-__v").sort("-createdAt").populate({
    path: "photos",
    populate: [
      {
        path: "comments",
        model: "Comment",
        populate: [{
          path: "commentator",
          model: "User",
          select: "_id fullName profilePhotoUrl",
        },
        {
          path: "taggs",
          model: "User",
          select: "_id fullName"
        },
        {
          path: "likes",
          model: "User",
          select: "_id fullName profilePhotoUrl"
        }]
      },{
        path: "likes",
        model: "User",
        select: "_id fullName profilePhotoUrl"
      }
    ]
  });
  
  const postsPhotos = photoAlbums.find(album => album.albumName.toLowerCase() === "post photos");
  
  if(postsPhotos) {
    return res.status(200).json({
      status: "success",
      postsPhotos,
      photoAlbums: photoAlbums.filter(album => album.albumName.toLowerCase() !== "posts photos")
    });
  } else {
    return res.status(200).json({
      status: "success",
      photoAlbums
    });
  }  
});

exports.getUserPhotoAlbums = catchAsync(async(req, res, next) => {
  const { userId } = req.params;

  const photoAlbums = await PhotoAlbum.find({user: userId}).select("-__v").sort("-createdAt").populate({
    path: "photos",
    populate: [
      {
        path: "comments",
        model: "Comment",
        populate: [{
          path: "commentator",
          model: "User",
          select: "_id fullName profilePhotoUrl"
        },
        {
          path: "likes",
          model: "User",
          select: "_id fullName profilePhotoUrl"
        }
    ]},{
        path: "likes",
        model: "User",
        select: "_id fullName profilePhotoUrl"
      }
    ]
  });

  res.status(200).json({
    status: "success",
    photoAlbums
  });
});

exports.createNewPhotoAlbum = catchAsync(async(req, res, next) => {
  const { name, photoDescriptions } = req.fields;

  const albumExistWithSameName = await PhotoAlbum.find({albumName: name});
  if(albumExistWithSameName.length > 0) return next(new AppError("Album with same name already exist. User another one", 400));

  const photos = req.files;
  if(!name || (name && name.trim().length === 0)) return next(new AppError("Album name is required", 400));

  let parsedDescriptions = {};
  if(photoDescriptions) {
    parsedDescriptions = JSON.parse(photoDescriptions);
  }

  let uploadedPhotos = [];
  if(Object.keys(photos).length > 0) {
    for(const photo in photos) {
      const result = await cloudinary.uploader.upload(photos[photo].path);
      uploadedPhotos.push({
        photo: {
          secure_url: result.secure_url,
          public_id: result.public_id
        },
        description: parsedDescriptions[parseInt(photo.split("_")[1]) - 1] || "",
        likes: [],
        comments: [],
        taggs: []
      });
    }
  }

  const photoAlbum = await PhotoAlbum.create({
    user: req.user._id,
    albumName: name,
    photos: uploadedPhotos
  });

  res.status(201).json({
    status: "success",
    photoAlbum
  });
});

exports.editPhotoAlbumName = catchAsync(async(req, res, next) => {
  const { albumId, newName } = req.body;

  if(!newName || (newName && newName.trim().length === 0)) return next(new AppError("Album name is required", 400));

  const albumExistWithSameName = await PhotoAlbum.find({albumName: newName});
  if(albumExistWithSameName.length > 0) return next(new AppError("Album with same name already exist. User another one", 400));

  const targetAlbum = await PhotoAlbum.findOne({_id: albumId, user: req.user._id});
  if(!targetAlbum) return next(new AppError("Album not found. Try refreshing the page", 404));

  targetAlbum.albumName = newName;
  await targetAlbum.save();

  res.status(200).json({ status: "success" });
});

exports.deletePhotoAlbum = catchAsync(async(req, res, next) => {
  const { albumId } = req.params;
  const albumToDelete = await PhotoAlbum.findOne({_id: albumId, user: req.user._id});
  if(!albumToDelete) return next(new AppError("Album not found. Maybe it was already deleted", 404));

  if(albumToDelete.photos.length > 0) {
    let comments = albumToDelete.photos.map(photo => photo.comments).flat(1);
    if(comments.length > 0) {
      for(const comment of comments) {
        await Comment.findByIdAndDelete(comment);
      }
    }

    let photoPublicIds = albumToDelete.photos.map(photo => photo.photo).flat(1).map(photo => photo.public_id);
    for(const publicId of photoPublicIds) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  await albumToDelete.delete();

  res.status(204).json({
    status: "success"
  })
});

exports.addPhotosToPhotoAlbum = catchAsync(async(req, res, next) => {
  const { albumId, photoDescriptions } = req.fields;

  const photos = req.files;

  let parsedDescriptions = {};
  if(photoDescriptions) {
    parsedDescriptions = JSON.parse(photoDescriptions);
  }

  const targetAlbum = await PhotoAlbum.findById(albumId);
  if(!targetAlbum) return next(new AppError("Album not found. Try refreshing the page", 404));

  if(Object.keys(photos).length > 0) {
    for(const photo in photos) {
      const result = await cloudinary.uploader.upload(photos[photo].path);
      targetAlbum.photos.unshift({
        photo: {
          secure_url: result.secure_url,
          public_id: result.public_id
        },
        description: parsedDescriptions[parseInt(photo.split("_")[1]) - 1] || "",
        likes: [],
        comments: [],
        taggs: []
      });
    }
  }

  await targetAlbum.save();

  res.status(200).json({
    status: "success",
    updatedPhotos: targetAlbum.photos
  });
});

exports.deletePhotoFromPhotoAlbum = catchAsync(async(req, res, next) => {
  const { albumId, photoId } = req.params;

  const targetAlbum = await PhotoAlbum.findById(albumId);
  if(!targetAlbum) return next(new AppError("Album not found. Try refreshing the page", 404));

  const targetPhotoIndex = targetAlbum.photos.findIndex(photo => photo._id.toString() === photoId);
  if(targetPhotoIndex === -1) return next(new AppError("Photo not found. Maybe it was already deleted", 404));

  const photoComments = targetAlbum.photos[targetPhotoIndex].comments;
  if(photoComments.length > 0) {
    for(const comment of photoComments) {
      await Comment.findByIdAndDelete(comment);
    }
  } 

  await cloudinary.uploader.destroy(targetAlbum.photos[targetPhotoIndex].photo.public_id);

  const newAlbumPhotos = targetAlbum.photos.filter(photo => photo._id.toString() !== photoId);
  targetAlbum.photos = newAlbumPhotos;

  await targetAlbum.save();

  res.status(204).json({ status: "success" });
});

exports.editPhotoDescription = catchAsync(async(req, res, next) => {
  const { albumId, photoId, newDescription } = req.body;

  const targetAlbum = await PhotoAlbum.findById(albumId);
  if(!targetAlbum) return next(new AppError("Album not found. Try refreshing the page", 404));

  const targetPhotoIndex = targetAlbum.photos.findIndex(photo => photo._id.toString() === photoId);
  if(targetPhotoIndex === -1) return next(new AppError("Photo not found. Maybe it was already deleted", 404));

  targetAlbum.photos[targetPhotoIndex].description = newDescription;
  await targetAlbum.save();

  res.status(200).json({ status: "success" });
});

exports.likePhoto = catchAsync(async(req, res, next) => {
  const { albumId, photoId } = req.body;

  const targetAlbum = await PhotoAlbum.findById(albumId);
  if(!targetAlbum) return next(new AppError("Album which contains photo is not found. Maybe it was deleted in the meantime", 404));

  const targetPhotoIndex = targetAlbum.photos.findIndex(photo => photo._id.toString() === photoId);
  if(targetPhotoIndex < 0) return next(new AppError("Photo you are trying to like is not found. Maybe it was deleted in the meantime.", 404));

  targetAlbum.photos[targetPhotoIndex].likes.unshift(req.user._id);
  await targetAlbum.save();

  let userNotification = null; 
  if(targetAlbum.user.toString() !== req.user._id.toString()) {
    userNotification = await Notification.create({
      user: targetAlbum.user,
      notificationType: "userLikedYourPhoto",
      fromUser: req.user._id,
      text: "liked your photo",
      albumId: targetAlbum._id,
      photoId: targetAlbum.photos[targetPhotoIndex]._id
    });

    userNotification = await userNotification.populate("fromUser", "_id fullName profilePhotoUrl");
  }

  res.status(200).json({
    status: "success",
    userLiked: {
      _id: req.user._id,
      fullName: req.user.fullName,
      profilePhotoUrl: req.user.profilePhotoUrl
    },
    userNotification
  });
});

exports.unlikePhoto = catchAsync(async(req, res, next) => {
  const { albumId, photoId } = req.body;

  const targetAlbum = await PhotoAlbum.findById(albumId);
  if(!targetAlbum) return next(new AppError("Album which contains photo is not found. Maybe it was deleted in the meantime", 404));

  const targetPhotoIndex = targetAlbum.photos.findIndex(photo => photo._id.toString() === photoId);
  if(targetPhotoIndex < 0) return next(new AppError("Photo you are trying to like is not found. Maybe it was deleted in the meantime.", 404));

  const newPhotoLikes = targetAlbum.photos[targetPhotoIndex].likes.filter(like => like.toString() !== req.user._id.toString());
  targetAlbum.photos[targetPhotoIndex].likes = newPhotoLikes;
  await targetAlbum.save();

  res.status(200).json({ status: "success", userUnlikedId: req.user._id });
});

exports.commentOnPhoto = catchAsync(async(req, res, next) => {
  const { albumId, photoId, commentText, taggs } = req.fields;

  const targetAlbum = await PhotoAlbum.findById(albumId);
  if(!targetAlbum) return next(new AppError("Can't find album that contains photo. Maybe it was deleted in the meantime. Try refreshing the page.", 404));

  const targetPhotoIndex = targetAlbum.photos.findIndex(photo => photo._id.toString() === photoId);
  if(targetPhotoIndex < 0) return next(new AppError("Can't find photo you are trying to comment on. Maybe it was deleted in the meantime.", 404));
  
  const commentPhoto = req.files.commentPhoto;
  const uploadedPhoto = {};

  if(commentPhoto) {
    const result = await cloudinary.uploader.upload(commentPhoto.path);
    if(result) {
      uploadedPhoto.secure_url = result.secure_url;
      uploadedPhoto.public_id = result.public_id;
    }
  }

  const parsedTaggs = JSON.parse(taggs);
  console.log(parsedTaggs);

  const newComment = await Comment.create({
    photoId,
    commentator: req.user._id,
    text: commentText || "",
    photo: uploadedPhoto,
    taggs: parsedTaggs || [],
    likes: []
  });
  
  targetAlbum.photos[targetPhotoIndex].comments.push(newComment._id);
  await targetAlbum.save();

  const populatedComment = (await newComment.populate("commentator", "_id fullName profilePhotoUrl"));

  let userNotification = null; 
  if(targetAlbum.user.toString() !== req.user._id.toString()) {
    userNotification = await Notification.create({
      user: targetAlbum.user,
      notificationType: "userCommentedOnYourPhoto",
      fromUser: req.user._id,
      text: "commented on your photo",
      albumId: targetAlbum._id,
      photoId: targetAlbum.photos[targetPhotoIndex]._id,
      commentId: newComment._id
    });

    userNotification = await userNotification.populate("fromUser", "_id fullName profilePhotoUrl");
  }

  let commentTaggsNotifications = [];
  if(parsedTaggs.length > 0) {
    for(const tagg of parsedTaggs) {
      const notification = await Notification.create({
        user: tagg.userId,
        notificationType: "userTaggedYouInCommentOnPhoto",
        fromUser: req.user._id,
        albumId: targetAlbum._id,
        photoId,
        commentId: newComment._id,
        text: "tagged you in comment on a photo"
      });

      const populated = await notification.populate("fromUser", "_id fullName profilePhotoUrl");
      commentTaggsNotifications.push(populated);
    }
  }

  res.status(201).json({
    status: "success",
    newComment: populatedComment,
    userNotification,
    commentTaggsNotifications
  });
});

exports.deletePhotoComment = catchAsync(async(req, res, next) => {
  const { albumId, photoId, commentId } = req.params;

  const targetComment = await Comment.findById(commentId);
  if(!targetComment) return next(new AppError("Comment not found. Maybe it was already deleted. Try refreshing the page.", 404));

  if(targetComment.commentator.toString() !== req.user._id.toString()) return next(new AppError("You cannot delete other people comments.", 400));

  const targetAlbum = await PhotoAlbum.findById(albumId);
  if(!targetAlbum) return next(new AppError("Album which contains photo doesn't exist. Maybe it was deleted in the meantime.", 404));

  const targetPhotoIndex = targetAlbum.photos.findIndex(photo => photo._id.toString() === photoId);
  if(targetPhotoIndex < 0) return next(new AppError("Photo not found. Maybe it was deleted in the meantime.", 404));

  const newPhotoComments = targetAlbum.photos[targetPhotoIndex].comments.filter(comment => comment.toString() !== commentId);
  targetAlbum.photos[targetPhotoIndex].comments = newPhotoComments;
  await targetAlbum.save();

  if(targetComment.photo && targetComment.photo.public_id) {
    await cloudinary.uploader.destroy(targetComment.photo.public_id);
  }

  await targetComment.delete();

  res.status(204).json({
    status: "success"
  });
});

exports.likePhotoComment = catchAsync(async(req, res, next) => {
  const { albumId, photoId, commentId } = req.body;

  const targetAlbum = await PhotoAlbum.findById(albumId);
  if(!targetAlbum) return next(new AppError("Album which contains photo doesn't exist. Maybe it was deleted in the meantime.", 404));

  const targetPhotoIndex = targetAlbum.photos.findIndex(photo => photo._id.toString() === photoId);
  if(targetPhotoIndex < 0) return next(new AppError("Photo not found. Maybe it was deleted in the meantime.", 404));

  const targetComment = await Comment.findById(commentId);
  if(!targetComment) return next(new AppError("Comment not found. Maybe it was already deleted. Try refreshing the page.", 404));

  targetComment.likes.push(req.user._id);
  await targetComment.save();

  let userNotification = null; 
  if(targetAlbum.user.toString() !== req.user._id.toString()) {
    userNotification = await Notification.create({
      user: targetAlbum.user,
      notificationType: "userLikedYourCommentOnPhoto",
      fromUser: req.user._id,
      text: "liked your photo comment",
      albumId: targetAlbum._id,
      photoId: targetAlbum.photos[targetPhotoIndex]._id,
      commentId: targetComment._id
    });

    userNotification = userNotification.populate("fromUser", "_id fullName profilePhotoUrl");
  }

  res.status(200).json({
    status: "success",
    userLiked: {
      _id: req.user._id,
      fullName: req.user.fullName,
      profilePhotoUrl: req.user.profilePhotoUrl
    },
    userNotification
  });
});

exports.unlikePhotoComment = catchAsync(async(req, res, next) => {
  // const { albumId, photoId, commentId } = req.body;
  const { commentId } = req.body;

  // const targetAlbum = await PhotoAlbum.findById(albumId);
  // if(!targetAlbum) return next(new AppError("Album which contains photo doesn't exist. Maybe it was deleted in the meantime.", 404));

  // const targetPhotoIndex = targetAlbum.photos.findIndex(photo => photo._id.toString() === photoId);
  // if(targetPhotoIndex < 0) return next(new AppError("Photo not found. Maybe it was deleted in the meantime.", 404));

  const targetComment = await Comment.findById(commentId);
  if(!targetComment) return next(new AppError("Comment not found. Maybe it was already deleted. Try refreshing the page.", 404));

  const newCommentLikes = targetComment.likes.filter(like => like.toString() !== req.user._id.toString());
  targetComment.likes = newCommentLikes;
  await targetComment.save();

  // const newPhotoLikes = targetAlbum.photos[targetPhotoIndex].likes.filter(like => like.toString() !== req.user._id.toString());

  res.status(200).json({
    status: "success",
    userUnlikedId: req.user._id
  });
});

exports.getSinglePhoto = catchAsync(async(req, res, next) => {
  const { albumId, photoId } = req.params;

  const album = await PhotoAlbum.findById(albumId).populate("user", "_id fullName profilePhotoUrl");
  if(!album) return next(new AppError("Can't find photo. Maybe it was deleted in the meantime", 404));

  const targetPhotoIndex = album.photos.findIndex(photo => photo._id.toString() === photoId);
  if(targetPhotoIndex < 0) return next(new AppError("Can't find photo. Maybe it was deleted in the meantime", 404));

  const populatedAlbum = await album.populate([
    {
      path: `photos.${targetPhotoIndex}.comments`,
      model: "Comment",
      populate: [{
        path: "commentator",
        model: "User",
        select: "_id fullName profilePhotoUrl"
      },
      {
        path: "likes",
        model: "User",
        select: "_id fullName profilePhotoUrl"
      }]
    },{
        path: `photos.${targetPhotoIndex}.likes`,
        model: "User",
        select: "_id fullName profilePhotoUrl"
      }
  ]);

  const photo = populatedAlbum.photos[targetPhotoIndex];

  res.status(200).json({
    status: "success",
    photo,
    user: album.user
  });
});