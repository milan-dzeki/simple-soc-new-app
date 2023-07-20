export interface IActivityLog {
  _id: string;
  user: string;
  action: "sentFriendRequest" | "unsendFriendRequest" | "acceptFriendRequest" | "declineFriendRequest" | "unfriendUser" | "searchUser" | "blockUser" | "unblockUser" | "createPost" | "editPost" | "deletePost" | "createAlbum" | "deleteAlbum" | "addPhotoToAlbum" | "deletePhotoFromAlbum" | "likePost" | "unlikePost" | "commentPost" | "editCommentOnPost" | "deleteCommentFromPost" | "likePostComment" | "unlikePostComment" | "likePhoto" | "unlikePhoto" | "commentPhoto" | "deleteCommentFromPhoto" | "likePhotoComment" | "unlikePhotoComment";
  targetUser?: {
    _id: string;
    fullName: string;
  };
  logText: string;
  albumId?: string;
  photoId?: string;
  postId?: string;
  commentId?: string;
  createdAt: Date;
}