import { IComment, IPost, IPostUser } from "./usePostsTypes";

export const updatePostsAfterLiking = (oldPosts: IPost[], targetPostId: string, userLiked: IPostUser): IPost[] => {
  const targetPostIndex = oldPosts.findIndex(post => post._id === targetPostId);
  if (targetPostIndex === -1) return oldPosts;

  const copiedPosts = [...oldPosts];
  const targetPost = copiedPosts[targetPostIndex];
  
  const newLikes = [
    ...targetPost.likes,
    userLiked
  ];

  const updatedPost = {
    ...targetPost,
    likes: newLikes
  };

  copiedPosts[targetPostIndex] = updatedPost;

  return copiedPosts;
};

export const updatePostsAfterUniking = (oldPosts: IPost[], targetPostId: string, userUnlikedId: string): IPost[] => {
  const targetPostIndex = oldPosts.findIndex(post => post._id === targetPostId);
  if (targetPostIndex === -1) return oldPosts;

  const copiedPosts = [...oldPosts];
  const newPost = { ...copiedPosts[targetPostIndex] };
  newPost.likes = newPost.likes.filter(like => like._id !== userUnlikedId);
  copiedPosts[targetPostIndex] = newPost;

  return copiedPosts;
};

export const updatePostsAfterCommenting = (oldPosts: IPost[], postId: string, comment: IComment): IPost[] => {
  const copiedPosts = [...oldPosts];

  const targetPostIndex = oldPosts.findIndex(post => post._id === postId);
  if(targetPostIndex === -1) return oldPosts;

  const newPost = { ...copiedPosts[targetPostIndex] };

  const newComments = [
    comment,
    ...newPost.comments
  ];

  newPost.comments = newComments;
  copiedPosts[targetPostIndex] = newPost;

  return copiedPosts;
};

export const updatePostsAfterCommentDeletion = (oldPosts: IPost[], targetPostId: string, commentId: string): IPost[] => {
  const targetPostIndex = oldPosts.findIndex(post => post._id === targetPostId);
  if(targetPostIndex === -1) return oldPosts;

  const copiedPosts = [...oldPosts];

  const newPost = { ...copiedPosts[targetPostIndex] };

  const newPostComments = newPost.comments.filter((comment: any) => comment._id !== commentId);

  newPost.comments = newPostComments
  copiedPosts[targetPostIndex] = newPost;

  return copiedPosts;
};

export const updatePostsAfterLikingComment = (oldPosts: IPost[], targetPostId: string, commentId: string, userLiked: IPostUser): IPost[] => {
  const targetPostIndex = oldPosts.findIndex(post => post._id === targetPostId);
  if(targetPostIndex === -1) return oldPosts;

  const copiedPosts = [...oldPosts];
  const targetCommentIndex = copiedPosts[targetPostIndex].comments.findIndex(comment => comment._id === commentId);
  if(targetCommentIndex === -1) return oldPosts;

  const newPost = { ...copiedPosts[targetPostIndex] };
  const copiedPostComments = [...newPost.comments];
  const copiedPostCommentLikes = [...copiedPostComments[targetCommentIndex].likes];

  const newComment = {...copiedPostComments[targetCommentIndex]};
  const newCommentLikes = [
    userLiked,
    ...copiedPostCommentLikes
  ];

  newComment.likes = newCommentLikes;
  newPost.comments[targetCommentIndex] = newComment;

  copiedPosts[targetPostIndex] = newPost;

  return copiedPosts;
};

export const updatePostsAfterUnlikingComment = (oldPosts: IPost[], targetPostId: string, commentId: string, userUnlikedId: string): IPost[] => {
  const targetPostIndex = oldPosts.findIndex(post => post._id === targetPostId);
  if(targetPostIndex === -1) return oldPosts;

  const copiedPosts = [...oldPosts];
  const targetCommentIndex = copiedPosts[targetPostIndex].comments.findIndex(comment => comment._id === commentId);
  if(targetCommentIndex === -1) return oldPosts;

  const newPost = { ...copiedPosts[targetPostIndex] };
  const newComment = {...newPost.comments[targetCommentIndex]};
  const newCommentLikes = newComment.likes.filter(like => like._id !== userUnlikedId);
  newComment.likes = newCommentLikes;
  newPost.comments[targetCommentIndex] = newComment;

  copiedPosts[targetPostIndex] = newPost;

  return copiedPosts;
};