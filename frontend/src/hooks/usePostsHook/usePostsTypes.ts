import { IInput } from "../../types/formsAndInputs/inputType";

// STATE STUFF
export interface IPostUser {
  _id: string;
  fullName: string;
  profilePhotoUrl: string;
}

export interface INotification {
  _id: string;
  user: string;
  fromUser: IPostUser;
  notificationType: "receivedFriendRequest" | "acceptedFriendRequest" | "userLikedYourPost" | "userCommentedOnYourPost" | "userPostedOnYourWall" | "userTaggedYouInPost" | "userTaggedYouInCommentOnPost" | "userTaggedYouInCommentOnPhoto" | "userLikedYourCommentOnPost" | "userLikedYourCommentOnPhoto" | "userLikedYourPhoto" | "userCommentedOnYourPhoto" | "userTaggedYouInPhoto";
  status: "unread" | "read";
  postId?: string;
  photoId?: string;
  commentId?: string;
  albumId?: string;
  text: string;
  createdAt: Date;
}

export interface IComment {
  _id: string;
  commentator: IPostUser;
  text: string;
  photoId: string;
  photo?: {
    secure_url: string;
    public_id: string;
  };
  likes: IPostUser[];
  taggs: {
    _id: string;
    userId: string;
    userFullName: string;
  }[];
  createdAt: Date;
  updatedAt: string;
}

export interface IPostPhoto {
  _id: string;
  albumId: string;
  photo: {
    secure_url: string;
    public_id: string;
  };
  decription: string;
  taggs: {
    _id: string;
    userId: string;
    fullName: string;
  }[];
  likes: any;
  comments: IComment[];
}

export interface IPost {
  _id: string;
  user: IPostUser;
  text: string;
  photos: IPostPhoto[];
  taggs: {
    _id: string;
    fullName: string;
  }[];
  likes: IPostUser[];
  comments: IComment[];
  createdAt: Date;
}

export interface ICreatePostData {
  modalShow: boolean;
  textInput: {[group: string]: IInput};
  photoFiles: File[];
  photoPreviews: string[];
  photoDescriptions: string[];
  taggs: {
    userId: string; 
    userFullName: string
  }[];
}

export interface IUsePostsState {
  postsLoading: boolean;
  postsErrorMsg: string | null;
  posts: IPost[];
  createPostData: ICreatePostData;
  postToEditId: string | null;
  postToDeleteId: string | null;
}

// ACTION STUFF
export enum UsePostsActionTypes {
  ON_POSTS_START = "ON_POSTS_START",
  ON_POSTS_ERROR = "ON_POSTS_ERROR",
  ON_CLEAR_POST_ERROR = "ON_CLEAR_POST_ERROR",
  ON_OPEN_POST_MODAL = "ON_OPEN_POST_MODAL",
  ON_CLOSE_POST_MODAL = "ON_CLOSE_POST_MODAL",
  ON_FOCUS_CREATE_POST_TEXT_INPUT = "ON_FOCUS_CREATE_POST_TEXT_INPUT",
  ON_UNFOCUS_CREATE_POST_TEXT_INPUT = "ON_UNFOCUS_CREATE_POST_TEXT_INPUT",
  ON_CHANGE_CREATE_POST_TEXT = "ON_CHANGE_CREATE_POST_TEXT",
  ON_ADD_CREATE_POST_PHOTOS = "ON_ADD_CREATE_POST_PHOTOS",
  ON_CHANGE_CREATE_POST_PHOTO_DESCRIPTION = "ON_CHANGE_CREATE_POST_PHOTO_DESCRIPTION",
  ON_REMOVE_CREATE_POST_PHOTO = "ON_REMOVE_CREATE_POST_PHOTO",
  ON_ADD_CREATE_POST_TAGGS = "ON_ADD_CREATE_POST_TAGGS",
  ON_REMOVE_CREATE_POST_TAGG = "ON_REMOVE_CREATE_POST_TAGG",
  ON_CREATE_POST_SUCCESS = "ON_CREATE_POST_SUCCESS",
  ON_GET_POSTS_SUCCESS = "ON_GET_POSTS_SUCCESS",
  ON_LOAD_POSTS_SUCCESS = "ON_LOAD_POSTS_SUCCESS",
  ON_PREPARE_DELETE_POST = "ON_PREPARE_DELETE_POST",
  ON_CANCEL_DELETE_POST = "ON_CANCEL_DELETE_POST",
  ON_DELETE_POST_SUCCESS = "ON_DELETE_POST_SUCCESS",
  ON_LIKE_POST_SUCCESS = "ON_LIKE_POST_SUCCESS",
  ON_UNLIKE_POST_SUCCESS = "ON_UNLIKE_POST_SUCCESS",
  ON_COMMENT_ON_POST_SUCCESS = "ON_COMMENT_ON_POST_SUCCESS",
  ON_LIKE_POST_COMMENT_SUCCESS = "ON_LIKE_POST_COMMENT_SUCCESS",
  ON_UNLIKE_POST_COMMENT_SUCCESS = "ON_UNLIKE_POST_COMMENT_SUCCESS",
  ON_DELETE_POST_COMMENT_SUCCESS = "ON_DELETE_POST_COMMENT_SUCCESS",
}

interface OnPostsStartAction {
  type: UsePostsActionTypes.ON_POSTS_START;
}
interface OnPostsErrorAction {
  type: UsePostsActionTypes.ON_POSTS_ERROR;
  errorMsg: string;
}
interface OnClearPostErrorAction {
  type: UsePostsActionTypes.ON_CLEAR_POST_ERROR;
}
interface OnOpenPostModalAction {
  type: UsePostsActionTypes.ON_OPEN_POST_MODAL;
}
interface OnClosePostModalAction {
  type: UsePostsActionTypes.ON_CLOSE_POST_MODAL;
}
interface OnFocusCreatePostTextInputAction {
  type: UsePostsActionTypes.ON_FOCUS_CREATE_POST_TEXT_INPUT;
}
interface OnUnocusCreatePostTextInputAction {
  type: UsePostsActionTypes.ON_UNFOCUS_CREATE_POST_TEXT_INPUT;
}
interface OnChangeCreatePostTextAction {
  type: UsePostsActionTypes.ON_CHANGE_CREATE_POST_TEXT;
  postText: string;
}
interface OnAddCreatePostPhotosAction {
  type: UsePostsActionTypes.ON_ADD_CREATE_POST_PHOTOS;
  photoFiles: File[];
  photoPreviews: string[];
  photoDescriptions: string[];
}
interface OnChangeCreatePostPhotoDescriptionAction {
  type: UsePostsActionTypes.ON_CHANGE_CREATE_POST_PHOTO_DESCRIPTION;
  photoIndex: number;
  descText: string;
}
interface OnRemoveCreatePostPhotoAction {
  type: UsePostsActionTypes.ON_REMOVE_CREATE_POST_PHOTO;
  photoIndex: number;
}
interface OnAddCreatePostTaggsAction {
  type: UsePostsActionTypes.ON_ADD_CREATE_POST_TAGGS;
  taggs: ICreatePostData["taggs"];
}
interface OnRemoveCreatePostTaggAction {
  type: UsePostsActionTypes.ON_REMOVE_CREATE_POST_TAGG;
  userId: string;
}
interface OnCreatePostSuccessAction {
  type: UsePostsActionTypes.ON_CREATE_POST_SUCCESS;
  newPost: IPost;
}
interface OnGetPostsSuccessAction {
  type: UsePostsActionTypes.ON_GET_POSTS_SUCCESS;
  posts: IPost[];
}
interface OnLoadPostsSuccessAction {
  type: UsePostsActionTypes.ON_LOAD_POSTS_SUCCESS;
  posts: IPost[];
}
interface OnPrepareDeletePostAction {
  type: UsePostsActionTypes.ON_PREPARE_DELETE_POST;
  postToDeleteId: string;
}
interface OnCancelDeletePostAction {
  type: UsePostsActionTypes.ON_CANCEL_DELETE_POST;
}
interface OnDeletePostSuccessAction {
  type: UsePostsActionTypes.ON_DELETE_POST_SUCCESS;
  postToDeleteId: string;
}
interface OnLikePostSuccessAction {
  type: UsePostsActionTypes.ON_LIKE_POST_SUCCESS;
  postId: string;
  userLiked: IPostUser;
}
interface OnUnlikePostSuccessAction {
  type: UsePostsActionTypes.ON_UNLIKE_POST_SUCCESS;
  postId: string;
  userUnlikedId: string;
}
interface OnCommentOnPostSuccessAction {
  type: UsePostsActionTypes.ON_COMMENT_ON_POST_SUCCESS;
  postId: string;
  comment: IComment;
}
interface OnLikePostCommentSuccessAction {
  type: UsePostsActionTypes.ON_LIKE_POST_COMMENT_SUCCESS;
  postId: string;
  commentId: string;
  userLiked: IPostUser;
}
interface OnUnlikePostCommentSuccessAction {
  type: UsePostsActionTypes.ON_UNLIKE_POST_COMMENT_SUCCESS;
  postId: string;
  commentId: string;
  userUnlikedId: string;
}
interface OnDeletePostCommentSuccessAction {
  type: UsePostsActionTypes.ON_DELETE_POST_COMMENT_SUCCESS;
  postId: string;
  commentId: string;
}

export type UsePostsAction = (
  OnPostsStartAction |
  OnPostsErrorAction |
  OnClearPostErrorAction |
  OnOpenPostModalAction |
  OnClosePostModalAction |
  OnFocusCreatePostTextInputAction |
  OnUnocusCreatePostTextInputAction |
  OnChangeCreatePostTextAction |
  OnAddCreatePostPhotosAction |
  OnChangeCreatePostPhotoDescriptionAction |
  OnRemoveCreatePostPhotoAction |
  OnAddCreatePostTaggsAction |
  OnRemoveCreatePostTaggAction |
  OnCreatePostSuccessAction |
  OnGetPostsSuccessAction |
  OnLoadPostsSuccessAction |
  OnPrepareDeletePostAction |
  OnCancelDeletePostAction |
  OnDeletePostSuccessAction |
  OnLikePostSuccessAction |
  OnUnlikePostSuccessAction |
  OnCommentOnPostSuccessAction |
  OnLikePostCommentSuccessAction |
  OnUnlikePostCommentSuccessAction |
  OnDeletePostCommentSuccessAction
);

// RESPONSE TYPES
export interface ICreatePostResponse {
  status: string;
  post: IPost;
  usersTaggedNotifications?: INotification[]; 
}

export interface IGetPostsResponse {
  status: string;
  posts: IPost[];
}

export interface ILikePostResponse {
  status: string;
  userLiked: IPostUser;
  userNotification?: INotification;
}

export interface IUnlikePostResponse {
  status: string;
  userUnlikedId: string;
}

export interface ICommentOnPostResponse {
  status: string;
  comment: IComment;
  userNotification?: INotification;
  commentTaggsNotifications?: INotification[];
}