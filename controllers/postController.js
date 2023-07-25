const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cloudinary = require("cloudinary").v2;
const cloudinaryConfig = require("../utils/cloudinaryConfig");
const findMutualFriends = require("../utils/findMutualFriends");
const Friends = require("../models/friendsModel");
const User = require("../models/userModel");
const ActivityLog = require("../models/activityLogModel");
const Post = require( "../models/postModel" );
const Notification = require("../models/notificationModel");
const Comment = require("../models/commentModel");
const PhotoAlbum = require("../models/photoAlbumModel");

cloudinary.config(cloudinaryConfig);

exports.getMyPosts = catchAsync(async(req, res, next) => {
  const posts = await Post.find({user: req.user._id}).populate("user", "_id fullName profilePhotoUrl").populate("taggs", "_id fullName").populate("likes", "_id fullName profilePhotoUrl").populate({
    path: "comments",
    model: "Comment",
    populate: [{
      path: "commentator",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }, {
      path: "likes",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }]
  }).sort("-createdAt");

  res.status(200).json({
    status: "success",
    posts
  });
});

exports.getSinglePost = catchAsync(async(req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate("user", "_id fullName profilePhotoUrl").populate("taggs", "_id fullName").populate("likes", "_id fullName profilePhotoUrl").populate({
    path: "comments",
    model: "Comment",
    populate: [{
      path: "commentator",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }, {
      path: "likes",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }]
  });

  res.status(200).json({
    status: "success",
    posts: post ? [post] : []
  });
});

exports.getUserPosts = catchAsync(async(req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  const amIBlocked = user.blockList.find(u => u.toString() === req.user._id);
  if(amIBlocked || user.active === false) return next(new AppError("User not found", 404));

  const haveIBlockedUser = req.user.blockList.find(u => u.toString() === userId);
  if(haveIBlockedUser) return next(new AppError("You blocked this user. Unblock to see posts", 400));

  const posts = await Post.find({user: userId}).populate("user", "_id fullName profilePhotoUrl").populate("taggs", "_id fullName").populate("likes", "_id fullName profilePhotoUrl").populate({
    path: "comments",
    model: "Comment",
    populate: [{
      path: "commentator",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }, {
      path: "likes",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }]
  }).sort("-createdAt");;

  res.status(200).json({
    status: "success",
    posts
  });
});

exports.getHomePageFriendsPosts = catchAsync(async(req, res, next) => {
  const myFriendsList = await Friends.findOne({user: req.user._id});

  const posts = await Post.find({
    $or: [
      {user: req.user._id},
      {user: {$in: myFriendsList.friends}}
    ]
  }).populate("user", "_id fullName profilePhotoUrl").populate("taggs", "_id fullName").populate("likes", "_id fullName profilePhotoUrl").populate({
    path: "comments",
    model: "Comment",
    populate: [{
      path: "commentator",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }, {
      path: "likes",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    }]
  }).sort("-createdAt");;

  res.status(200).json({
    status: "success",
    posts
  });
});

exports.createPost = catchAsync(async(req, res, next) => {
  const { text, taggs, photoDescriptions } = req.fields;

  let providedTaggs = [];
  if(taggs) {
    providedTaggs = JSON.parse(taggs);
  }

  let providedDescriptions = [];
  if(photoDescriptions) {
    providedDescriptions = JSON.parse(photoDescriptions);
  }

  const photos = req.files;
  if((!text || (text && text.trim().length === 0)) && Object.keys(photos).length === 0) return next(new AppError("Cannot create empty post", 400));

  let createdPhotos = [];
  if(Object.keys(photos).length > 0) {
    // let postsAlbum = await PhotoAlbum.findOne({name: "Posts Photos"});
    // if(!postsAlbum) {
    //   postsAlbum = await PhotoAlbum.create({
    //     user: req.user._id,
    //     albumName: "Posts Photos",
    //     photos: []
    //   });
    // }
    for(const photo in photos) {
      const result = await cloudinary.uploader.upload(photos[photo].path);
      createdPhotos.push({
        albumId: postsAlbum._id,
        photo: {
          secure_url: result.secure_url,
          public_id: result.public_id,
          description: providedDescriptions[parseInt(photo.split("_")[1]) - 1] || "",
          taggs: [],
          likes: [],
          comments: []
        }
      });
    }
  }

  const post = await Post.create({
    user: req.user._id,
    text: text || "",
    photos: createdPhotos,
    taggs: providedTaggs,
    likes: [],
    comments: []
  });

  const populatedPost = await post.populate([
    {
      path: "user",
      model: "User",
      select: "_id fullName profilePhotoUrl"
    },
    {
      path: "taggs",
      model: "User",
      select: "_id fullName"
    }
  ]);

  await ActivityLog.create({
    user: req.user._id,
    action: "createPost",
    logText: "You created a post",
    postId: post._id
  });

  let usersTaggedNotifications = [];

  if(providedTaggs.length > 0) {
    for(const tagg of providedTaggs) {
      const notification = await Notification.create({
        user: tagg,
        notificationType: "userTaggedYouInPost",
        fromUser: {
          _id: req.user._id,
          fullName: req.user.fullName,
          profilePhotoUrl: req.user.profilePhotoUrl
        },
        text: `${req.user.fullName} tagged you in a post`,
        postId: post._id
      });

      const populatedNotification = await notification.populate("fromUser", "_id fullName profilePhotoUrl");

      usersTaggedNotifications.push(populatedNotification);
    }
  }

  res.status(200).json({
    status: "success",
    post: populatedPost,
    usersTaggedNotifications
  });
});

exports.editPost = catchAsync(async(req, res, next) => {
  const { postId, newText, preservedTaggIds, preservedPhotoIds } = req.fields;

  let convertedPreservedTaggIds = [];
  if(preservedTaggIds) {
    convertedPreservedTaggIds = JSON.parse(preservedTaggIds);
  }

  const newPhotos = req.files;

  let convertedPreservedPhotoIds = [];
  if(preservedPhotoIds) {
    convertedPreservedPhotoIds = JSON.parse(preservedPhotoIds);
  }

  if((!newText || (newText && newText.trim().length === 0)) && Object.keys(newPhotos).length === 0 && convertedPreservedPhotoIds.length === 0) return next(new AppError("Post cannot be empty", 400)); 

  const targetPost = await Post.findById(postId);
  if(!targetPost) return next(new AppError("Post not found. Maybe it was already deleted", 404));

  if(targetPost.photos.length > convertedPreservedPhotoIds.length) {
    const photosToDelete = targetPost.photos.filter(photo => !convertedPreservedPhotoIds.includes(photo._id.toString()));
    
    for(const photo of photosToDelete) {
      await cloudinary.uploader.destroy(photo.public_id);
    }

    const newPostPhotos = targetPost.photos.filter(photo => convertedPreservedPhotoIds.includes(photo._id.toString()));
    targetPost.photos = newPostPhotos;
    // await targetPost.save();
  }

  if(Object.keys(newPhotos).length > 0) {
    for(const photo in newPhotos) {
      const result = await cloudinary.uploader.upload(newPhotos[photo].path);
      targetPost.photos.push({
        secure_url: result.secure_url,
        public_id: result.public_id
      });
    }
  }

  let usersTaggedNotifications = [];

  if(convertedPreservedTaggIds.length > 0) {
    const postTaggIds = targetPost.taggs.map(tagg => tagg.toString());
    const newTaggs = convertedPreservedTaggIds.filter(tagg => !postTaggIds.includes(tagg));

    if(newTaggs.length > 0) {
      for(const tagg of newTaggs) {
        const notification = await Notification.create({
          user: tagg,
          notificationType: "userTaggedYouInPost",
          fromUser: {
            _id: req.user._id,
            fullName: req.user.fullName,
            profilePhotoUrl: req.user.profilePhotoUrl
          },
          text: `${req.user.fullName} tagged you in a post`,
          postId: targetPost._id
        });

        usersTaggedNotifications.push(notification);
      }
    }
  }

  targetPost.taggs = convertedPreservedTaggIds;
  targetPost.text = newText || "";
  await targetPost.save();

  const populatedNewPost = await targetPost.populate("taggs", "_id fullName profilePhotoUrl");

  await ActivityLog.create({
    user: req.user._id,
    action: "editPost",
    logText: "You edited a post",
    postId: targetPost._id
  });

  res.status(200).json({
    status: "success",
    post: populatedNewPost,
    usersTaggedNotifications
  });
});

exports.deletePost = catchAsync(async(req, res, next) => {
  const { postId } = req.params;

  const postToDelete = await Post.findOne({_id: postId, user: req.user._id});
  if(!postToDelete) return next(new AppError("Post doesn't seem to exits anymore. You probably already deleted it", 404));

  if(postToDelete.comments.length > 0) {
    const postComments = await Comment.find({postId});
    console.log(postComments);
    
    for(const comment of postComments) {
      if(comment.photo && comment.photo.public_id) {
        await cloudinary.uploader.destroy(comment.photo.public_id);
      }
    }
  }

  await Comment.deleteMany({postId});
  
  if(postToDelete.photos.length > 0) {
    for(const photo of postToDelete.photos) {
      await cloudinary.uploader.destroy(photo.photo.public_id);
    }
  }

  await postToDelete.delete();

  await ActivityLog.create({
    user: req.user._id,
    action: "deletePost",
    logText: "You deleted a post"
  });
  
  res.status(204).json({
    status: "success"
  });
});

exports.likePost = catchAsync(async(req, res, next) => {
  const { postId } = req.body;

  const post = await Post.findById(postId);
  if(!post) return next(new AppError("Post not found. Maybe it was deleted in the meantime", 404));

  post.likes.push(req.user._id);
  await post.save();

  await ActivityLog.create({
    user: req.user._id,
    action: "likePost",
    logText: "You liked a post",
    postId: post._id,
    targetUser: post.user
  });

  let userNotification = null;
  let populatedNotification = null;
  if(post.user.toString() !== req.user._id.toString()) {
    userNotification = await Notification.create({
      user: post.user,
      notificationType: "userLikedYourPost",
      fromUser: {
        _id: req.user._id,
        fullName: req.user.fullName,
        profilePhotoUrl: req.user.profilePhotoUrl
      },
      postId: post._id,
      text: "liked your post"
    });

    populatedNotification = await userNotification.populate("fromUser", "_id fullName profilePhotoUrl");
  }
  

  res.status(200).json({
    status: "success",
    userLiked: {
      _id: req.user._id,
      fullName: req.user.fullName,
      profilePhotoUrl: req.user.profilePhotoUrl
    },
    userNotification: populatedNotification
  });
});

exports.unlikePost = catchAsync(async(req, res, next) => {
  const { postId } = req.body;

  const post = await Post.findById(postId);
  if(!post) return next(new AppError("Post not found. Maybe it was deleted in the meantime", 404));

  const newLikes = post.likes.filter(u => u.toString() !== req.user._id.toString());
  post.likes = newLikes;
  await post.save();

  await ActivityLog.create({
    user: req.user._id,
    action: "unlikePost",
    logText: "You unliked a post",
    postId: post._id,
    targetUser: post.user
  });

  res.status(200).json({
    status: "success",
    userUnlikedId: req.user._id
  });
});

exports.commentOnPost = catchAsync(async(req, res, next) => {
  const { postId, commentText, taggs } = req.fields;
  const commentPhoto = req.files.photo;

  const post = await Post.findById(postId);
  if(!post) return next(new AppError("Post not found. Maybe it was deleted in the meantime", 404));

  let parsedTaggs = [];
  if(taggs) {
    parsedTaggs = JSON.parse(taggs);
  }
  console.log(parsedTaggs);
  if((!commentText || (commentText && commentText.trim().length === 0)) && parsedTaggs.length === 0 && !commentPhoto) return next(new AppError("Cannot post an empty comment", 400));

  const comment = await Comment.create({
    postId: postId,
    commentator: req.user._id,
    text: commentText || "",
    taggs: parsedTaggs,
    photo: {}
  });

  if(commentPhoto) {
    const result = await cloudinary.uploader.upload(commentPhoto.path);
    comment.photo = {
      secure_url: result.secure_url,
      public_id: result.public_id
    };

    await comment.save();
  }

  let commentTaggsNotifications = [];
  if(parsedTaggs.length > 0) {
    for(const tagg of parsedTaggs) {
      const notification = await Notification.create({
        user: tagg.userId,
        notificationType: "userTaggedYouInCommentOnPost",
        fromUser: req.user._id,
        postId,
        commentId: comment._id,
        text: "tagged you in comment on a post"
      });

      const populated = await notification.populate("fromUser", "_id fullName profilePhotoUrl");

      commentTaggsNotifications.push(populated);
    }
  }

  post.comments.push(comment);
  await post.save();

  let userNotification = null;
  let populatedUserNotification = null;

  if(req.user._id.toString() !== post.user.toString()) {
    userNotification = await Notification.create({
      user: post.user,
      notificationType: "userCommentedOnYourPost",
      fromUser: req.user._id,
      postId,
      commentId: comment._id,
      text: "commented on your post"
    });

    populatedUserNotification = await userNotification.populate("fromUser", "_id fullName profilePhotoUrl");
  }

  let activityLogText = "";
  let acitvityLogPhoto = "";
  if(commentText) {
    activityLogText = `You commented on a post: <${commentText}>`;
  } else if(!commentText && comment.photo.secure_url) {
    activityLogText = "You commented on a post with photo";
    acitvityLogPhoto = comment.photo.secure_url;
  } else if(!commentText && !comment.photo.secure_url && parsedTaggs.length > 0) {
    activityLogText = "You tagged someone in a comment on post";
  }
  await ActivityLog.create({
    user: req.user._id,
    action: "commentPost",
    postId,
    targetUser: post.user,
    logText: activityLogText,
    logPhotoUrl: acitvityLogPhoto
  });

  const populatedComment = await comment.populate("commentator", "_id fullName profilePhotoUrl");

  res.status(200).json({
    status: "success",
    comment: populatedComment,
    userNotification: populatedUserNotification,
    commentTaggsNotifications
  });
});

exports.deletePostComment = catchAsync(async(req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await Post.findById(postId);
  if(!post) return next(new AppError("Post not found. Maybe it was deleted in the meantime", 404));

  const comment = await Comment.findById(commentId);
  if(!comment) return next(new AppError("Comment not found. Maybe the post was deleted.", 404));

  if(comment.photo.public_id) {
    await cloudinary.uploader.destroy(comment.photo.public_id);
  }
  await comment.delete();
  const newPostComments = post.comments.filter(comment => comment.toString() !== commentId);
  post.comments = newPostComments;
  await post.save();

  await ActivityLog.create({
    user: req.user._id,
    action: "deleteCommentFromPost",
    postId,
    targetUser: post.user,
    logText: "You deleted comment from post"
  });

  res.status(204).json({
    status: "success"
  });
});

exports.likePostComment = catchAsync(async(req, res, next) => {
  const { postId, commentId } = req.body;
  
  const post = await Post.findById(postId);
  if(!post) return next(new AppError("Post not found. Maybe ot was deleted", 404));

  const comment = await Comment.findById(commentId);
  if(!comment) return next(new AppError("Comment doesn't exist. Maybe it was deleted", 404));

  comment.likes.push(req.user._id);
  await comment.save();

  await ActivityLog.create({
    user: req.user._id,
    action: "likePostComment",
    postId,
    commentId,
    targetUser: post.user,
    logText: "You liked a comment on post"
  });

  let userNotification = null;
  let populatedNotification = null;
  if(comment.commentator.toString() !== req.user._id.toString()) {
    userNotification = await Notification.create({
      user: comment.commentator,
      notificationType: "userLikedYourCommentOnPost",
      fromUser: {
        _id: req.user._id,
        fullName: req.user.fullName,
        profilePhotoUrl: req.user.profilePhotoUrl
      },
      postId,
      commentId,
      text: "liked your comment on post"
    });

    populatedNotification = await userNotification.populate("fromUser", "_id fullName profilePhotoUrl");
  }

  res.status(200).json({
    status: "succes",
    userLiked: {
      _id: req.user._id,
      fullName: req.user.fullName,
      profilePhotoUrl: req.user.profilePhotoUrl
    },
    userNotification: populatedNotification
  });
});

exports.unlikePostComment = catchAsync(async(req, res, next) => {
  const { commentId } = req.body;

  const comment = await Comment.findById(commentId);
  if(!comment) return next(new AppError("Comment doesn't exist. Maybe it was deleted", 404));

  const newCommentLikes = comment.likes.filter(u => u.toString() !== req.user._id.toString());
  comment.likes = newCommentLikes;
  await comment.save();

  await ActivityLog.create({
    user: req.user._id,
    action: "unlikePostComment",
    postId: comment.postId,
    commentId,
    targetUser: comment.user,
    logText: "You unliked a comment on post"
  });
  
  res.status(200).json({
    status: "success",
    userUnlikedId: req.user._id
  });
});