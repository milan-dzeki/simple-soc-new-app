import { INotification } from "../../store/types/notificationsTypes";
import { IInput } from "../../types/formsAndInputs/inputType";

// STATE STUFF
export interface IPhotoUser {
  _id: string;
  fullName: string;
  profilePhotoUrl: string;
}

export interface IComment {
  _id: string;
  commentator: IPhotoUser;
  text: string;
  photoId: string;
  photo?: {
    secure_url: string;
    public_id: string;
  };
  likes: IPhotoUser[];
  taggs: {
    userId: string;
    userFullName: string;
  }[];
  createdAt: Date;
  updatedAt: string;
}

export interface IPhoto {
  _id: string;
  description: string;
  photo: {
    secure_url: string;
    public_id: string;
  };
  likes: IPhotoUser[];
  comments: IComment[];
  taggs: {
    userId: string;
    userFullName: string;
  }[];
  post?: string;
  createdAt: Date;
}

export interface IPhotoAlbum {
  _id: string;
  albumName: string;
  user: string;
  photos: IPhoto[];
}

export interface IUsePhotosState {
  photosLoading: boolean;
  photosErrorMsg: string | null;
  albums: IPhotoAlbum[];
  selectedAlbum: IPhotoAlbum | null;
  albumModalInfo: {
    albumId: string | null;
    actionType: "create" | "editName" | "addPhotos" | null;
    nameInput: {[group: string]: IInput};
    photoFiles: File[];
    photoPreviews: string[];
    photoDescriptions: string[];
    modalFormValid: boolean;
  };
  photoSliderInfo: {
    show: boolean;
    currentPhotoIndex: number;
  };
}

// ACTION STUFF
export enum IUsePhotosActionTypes {
  ON_PHOTOS_START = "ON_PHOTOS_START",
  ON_PHOTOS_ERROR = "ON_PHOTOS_ERROR",
  ON_CLEAR_PHOTOS_ERROR = "ON_CLEAR_PHOTOS_ERROR",
  ON_GET_PHOTO_ALBUMS_SUCCESS = "ON_GET_PHOTO_ALBUMS_SUCCESS",
  ON_SELECT_PHOTO_ALBUM_SUCCESS = "ON_SELECT_PHOTO_ALBUM_SUCCESS",
  ON_UNSELECT_PHOTO_ALBUM_SUCCESS = "ON_UNSELECT_PHOTO_ALBUM_SUCCESS",
  ON_OPEN_PHOTO_ALBUM_MODAL = "ON_OPEN_PHOTO_ALBUM_MODAL",
  ON_CLOSE_PHOTO_ALBUM_MODAL = "ON_CLOSE_PHOTO_ALBUM_MODAL",
  ON_PHOTO_ALBUM_MODAL_INPUT_NAME_FOCUSED = "ON_PHOTO_ALBUM_MODAL_INPUT_NAME_FOCUSED", 
  ON_PHOTO_ALBUM_MODAL_INPUT_NAME_UNFOCUSED = "ON_PHOTO_ALBUM_MODAL_INPUT_NAME_UNFOCUSED", 
  ON_PHOTO_ALBUM_MODAL_INPUT_NAME_CHANGED = "ON_PHOTO_ALBUM_MODAL_INPUT_NAME_CHANGED", 
  ON_PHOTO_ALBUM_MODAL_UPLOAD_PHOTOS = "ON_PHOTO_ALBUM_MODAL_UPLOAD_PHOTOS", 
  ON_PHOTO_ALBUM_MODAL_REMOVE_PHOTO = "ON_PHOTO_ALBUM_MODAL_REMOVE_PHOTO", 
  ON_PHOTO_ALBUM_MODAL_PHOTO_DESCRIPTION_CHANGED = "ON_PHOTO_ALBUM_MODAL_PHOTO_DESCRIPTION_CHANGED", 
  ON_CREATE_PHOTO_ALBUM_SUCCESS = "ON_CREATE_PHOTO_ALBUM_SUCCESS", 
  ON_EDIT_PHOTO_ALBUM_NAME_SUCCESS = "ON_EDIT_PHOTO_ALBUM_NAME_SUCCESS",
  ON_ADD_PHOTOS_TO_PHOTO_ALBUM_SUCCESS = "ON_ADD_PHOTOS_TO_PHOTO_ALBUM_SUCCESS", 
  ON_DELETE_PHOTO_ALBUM_SUCCESS = "ON_DELETE_PHOTO_ALBUM_SUCCESS",
  ON_DELETE_SINGLE_PHOTO_FROM_PHOTO_ALBUM_SUCCESS = "ON_DELETE_SINGLE_PHOTO_FROM_PHOTO_ALBUM_SUCCESS",
  ON_OPEN_PHOTO_SLIDER = "ON_OPEN_PHOTO_SLIDER", 
  ON_CLOSE_PHOTO_SLIDER = "ON_CLOSE_PHOTO_SLIDER", 
  ON_SLIDER_PREV_PHOTO = "ON_SLIDER_PREV_PHOTO", 
  ON_SLIDER_NEXT_PHOTO = "ON_SLIDER_NEXT_PHOTO", 
  ON_LIKE_PHOTO_SUCCESS = "ON_LIKE_PHOTO_SUCCESS",
  ON_UNLIKE_PHOTO_SUCCESS = "ON_UNLIKE_PHOTO_SUCCESS",
  ON_COMMENT_ON_PHOTO_SUCCESS = "ON_COMMENT_ON_PHOTO_SUCCESS",
  ON_DELETE_PHOTO_COMMENT_SUCCESS = "ON_DELETE_PHOTO_COMMENT_SUCCESS",
  ON_LIKE_PHOTO_COMMENT_SUCCESS = "ON_LIKE_PHOTO_COMMENT_SUCCESS",
  ON_UNLIKE_PHOTO_COMMENT_SUCCESS = "ON_UNLIKE_PHOTO_COMMENT_SUCCESS",
  ON_CHANGE_PHOTO_DESCRIPTION_SUCCESS = "ON_CHANGE_PHOTO_DESCRIPTION_SUCCESS"
}

interface OnPhotosStartAction {
  type: IUsePhotosActionTypes.ON_PHOTOS_START;
}
interface OnPhotosErrorAction {
  type: IUsePhotosActionTypes.ON_PHOTOS_ERROR;
  errorMsg: string;
}
interface OnClearPhotosErrorAction {
  type: IUsePhotosActionTypes.ON_CLEAR_PHOTOS_ERROR;
}
interface OnGetPhotoAlbumsSuccessAction {
  type: IUsePhotosActionTypes.ON_GET_PHOTO_ALBUMS_SUCCESS;
  albums: IPhotoAlbum[];
}
interface OnSelectPhotoAlbumAction {
  type: IUsePhotosActionTypes.ON_SELECT_PHOTO_ALBUM_SUCCESS;
  selectedAlbum: IPhotoAlbum;
}
interface OnUnselectPhotoAlbumAction {
  type: IUsePhotosActionTypes.ON_UNSELECT_PHOTO_ALBUM_SUCCESS;
}
interface OnOpenPhotoAlbumModalAction {
  type: IUsePhotosActionTypes.ON_OPEN_PHOTO_ALBUM_MODAL;
  albumId: string | null;
  actionType: "create" | "editName" | "addPhotos" | null;
  targetAlbumName: string | null;
}
interface OnClosePhotoAlbumModalAction {
  type: IUsePhotosActionTypes.ON_CLOSE_PHOTO_ALBUM_MODAL;
}
interface OnPhotoAlbumModalInputNameFocusedAction {
  type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_FOCUSED;
}
interface OnPhotoAlbumModalInputNameUnfocusedAction {
  type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_UNFOCUSED;
}
interface OnPhotoAlbumModalInputNameChangedAction {
  type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_INPUT_NAME_CHANGED;
  inputValue: string;
}
interface OnPhotoAlbumModalUploadPhotosAction {
  type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_UPLOAD_PHOTOS;
  photoFiles: File[];
  photoPreviews: string[];
  photoDescriptions: string[];
}
interface OnPhotoAlbumModalRemovePhotoAction {
  type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_REMOVE_PHOTO;
  photoIndex: number;
}
interface OnPhotoAlbumModalPhotoDescriptionChangedAction {
  type: IUsePhotosActionTypes.ON_PHOTO_ALBUM_MODAL_PHOTO_DESCRIPTION_CHANGED;
  descIndex: number;
  descValue: string;
}
interface OnCreatePhotoAlbumSuccessAction {
  type: IUsePhotosActionTypes.ON_CREATE_PHOTO_ALBUM_SUCCESS;
  photoAlbum: IPhotoAlbum;
}
interface OnEditPhotoAlbumNameSuccess {
  type: IUsePhotosActionTypes.ON_EDIT_PHOTO_ALBUM_NAME_SUCCESS;
  albumId: string;
  newName: string;
}
interface OnAddPhotosToPhotoAlbumSuccessAction {
  type: IUsePhotosActionTypes.ON_ADD_PHOTOS_TO_PHOTO_ALBUM_SUCCESS;
  albumId: string;
  updatedPhotos: IPhotoAlbum["photos"];
}
interface OnDeletePhotoAlbumSuccessAction {
  type: IUsePhotosActionTypes.ON_DELETE_PHOTO_ALBUM_SUCCESS;
  albumToDeleteId: string;
}
interface OnDeleteSinglePhotoFromPhotoAlbumSuccessAction {
  type: IUsePhotosActionTypes.ON_DELETE_SINGLE_PHOTO_FROM_PHOTO_ALBUM_SUCCESS;
  albumId: string;
  photoId: string;
}
interface OnOpenPhotoSliderAction {
  type: IUsePhotosActionTypes.ON_OPEN_PHOTO_SLIDER;
  currentPhotoIndex: number;
}
interface OnClosePhotoSliderAction {
  type: IUsePhotosActionTypes.ON_CLOSE_PHOTO_SLIDER;
}
interface OnSliderPrevPhotoAction {
  type: IUsePhotosActionTypes.ON_SLIDER_PREV_PHOTO;
}
interface OnSliderNextPhotoAction {
  type: IUsePhotosActionTypes.ON_SLIDER_NEXT_PHOTO;
}
interface OnLikePhotoSuccessAction {
  type: IUsePhotosActionTypes.ON_LIKE_PHOTO_SUCCESS;
  albumId: string;
  photoId: string;
  userLiked: IPhotoUser;
}
interface OnUnlikePhotoSuccessAction {
  type: IUsePhotosActionTypes.ON_UNLIKE_PHOTO_SUCCESS;
  albumId: string;
  photoId: string;
  userUnlikedId: string;
}
interface OnCommentOnPhotoSuccessAction {
  type: IUsePhotosActionTypes.ON_COMMENT_ON_PHOTO_SUCCESS;
  albumId: string;
  photoId: string;
  comment: IComment;
}
interface OnDeletePhotoCommentSuccessAction {
  type: IUsePhotosActionTypes.ON_DELETE_PHOTO_COMMENT_SUCCESS;
  albumId: string;
  photoId: string;
  commentId: string;
}
interface OnLikePhotoCommentSuccessAction {
  type: IUsePhotosActionTypes.ON_LIKE_PHOTO_COMMENT_SUCCESS;
  albumId: string;
  photoId: string;
  commentId: string;
  userLiked: IPhotoUser;
}
interface OnUnlikePhotoCommentSuccessAction {
  type: IUsePhotosActionTypes.ON_UNLIKE_PHOTO_COMMENT_SUCCESS;
  albumId: string;
  photoId: string;
  commentId: string;
  userUnlikedId: string;
}
interface OnChangePhotodescriptionSuccessAction {
  type: IUsePhotosActionTypes.ON_CHANGE_PHOTO_DESCRIPTION_SUCCESS;
  albumId: string;
  photoId: string;
  newDescriptionValue: string;
}

export type IUsePhotosAction = (
  OnPhotosStartAction |
  OnPhotosErrorAction |
  OnClearPhotosErrorAction |
  OnGetPhotoAlbumsSuccessAction |
  OnSelectPhotoAlbumAction |
  OnUnselectPhotoAlbumAction |
  OnOpenPhotoAlbumModalAction |
  OnClosePhotoAlbumModalAction |
  OnPhotoAlbumModalInputNameFocusedAction |
  OnPhotoAlbumModalInputNameUnfocusedAction |
  OnPhotoAlbumModalInputNameChangedAction |
  OnPhotoAlbumModalUploadPhotosAction |
  OnPhotoAlbumModalRemovePhotoAction |
  OnPhotoAlbumModalPhotoDescriptionChangedAction |
  OnCreatePhotoAlbumSuccessAction |
  OnEditPhotoAlbumNameSuccess |
  OnAddPhotosToPhotoAlbumSuccessAction |
  OnDeletePhotoAlbumSuccessAction |
  OnDeleteSinglePhotoFromPhotoAlbumSuccessAction |
  OnOpenPhotoSliderAction |
  OnClosePhotoSliderAction |
  OnSliderPrevPhotoAction |
  OnSliderNextPhotoAction |
  OnLikePhotoSuccessAction |
  OnUnlikePhotoSuccessAction |
  OnCommentOnPhotoSuccessAction |
  OnDeletePhotoCommentSuccessAction |
  OnLikePhotoCommentSuccessAction |
  OnUnlikePhotoCommentSuccessAction |
  OnChangePhotodescriptionSuccessAction
);

// RESPONSE and ASYNC TYPES
export interface IGetAlbumsResponse {
  status: string;
  photoAlbums: IPhotoAlbum[];
}

export interface ICreateAlbumResponse {
  status: string;
  photoAlbum: IPhotoAlbum
}

export interface IAddPhotosToAlbumResponse {
  status: string;
  updatedPhotos: IPhotoAlbum["photos"];
}

export interface ILikePhotoResponse {
  status: string;
  userLiked: IPhotoUser;
  userNotification?: INotification;
}

export interface IUnlikePhotoResponse {
  status: string;
  userUnlikedId: string;
}

export interface ICommentOnPhotoResponse {
  status: string;
  newComment: IComment;
  userNotification?: INotification;
  commentTaggsNotifications?: INotification[];
}

export interface ICreateAlbumInfo {
  albumName: string;
  photoFiles: File[] | null;
  photoDescriptions: string[];
}

export interface ILikePhotoCommentResponse {
  status: string;
  userLiked: IPhotoUser;
}

export interface IUnlikePhotoCommentResponse {
  status: string;
  userUnlikedId: string;
}