export interface IBlockedUser {
  _id: string;
  fullName: string;
  profilePhotoUrl: string;
}

export interface IAuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female" | "unset";
  profilePhotoUrl: string;
  profilePhotoPublicId: string;
  lastTimeSeen: Date;
  createdAt: Date;
  blockList: IBlockedUser[];
  blockedMe: string[];
}

export interface ISendEditUserData {
  firstName: string;
  lastName: string;
  email: string;
  gender: "male" | "female" | "unset";
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

export interface IEditUserData {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  gender: "male" | "female" | "unset";
  dateOfBirth: string;
}

export interface IAuthState {
  initLoading: boolean;
  authLoading: boolean;
  authErrorMsg: string | null;
  token: string | null;
  authUser: IAuthUser | null;
  userJustBlocked: boolean;
}

export enum AuthActionTypes {
  ON_AUTH_START = "ON_AUTH_START",
  ON_AUTH_FAIL = "ON_AUTH_FAIL",
  ON_CLEAR_AUTH_ERROR = "ON_CLEAR_AUTH_ERROR",
  ON_AUTH_SUCCESS = "ON_AUTH_SUCCESS",
  ON_LOGOUT = "ON_LOGOUT",
  ON_BLOCK_USER_SUCCESS = "ON_BLOCK_USER_SUCCESS",
  ON_UNBLOCK_USER_SUCCESS = "ON_UNBLOCK_USER_SUCCESS",
  ON_EDIT_USER_DATA = "ON_EDIT_USER_DATA",
  ON_UPLOAD_NEW_PROFILE_PHOTO_SUCCESS = "ON_UPLOAD_NEW_PROFILE_PHOTO_SUCCESS",
  ON_REMOVE_PROFILE_PHOTO_SUCCESS = "ON_REMOVE_PROFILE_PHOTO_SUCCESS",
  ON_DEACTIVATE_ACCOUNT_SUCCESS = "ON_DEACTIVATE_ACCOUNT_SUCCESS",
  ON_DELETE_ACCOUNT_SUCCESS = "ON_DELETE_ACCOUNT_SUCCESS",
  RESET_BLOCK_STATE = "RESET_BLOCK_STATE"
}

export interface OnAuthStartAction  {
  type: AuthActionTypes.ON_AUTH_START;
}
export interface OnAuthFailAction {
  type: AuthActionTypes.ON_AUTH_FAIL;
  errorMsg: string;
}
export interface OnClearAuthErrorAction {
  type: AuthActionTypes.ON_CLEAR_AUTH_ERROR;
}
export interface OnAuthSuccessAction {
  type: AuthActionTypes.ON_AUTH_SUCCESS;
  token: string;
  user: IAuthUser;
}
export interface OnLogoutAction {
  type: AuthActionTypes.ON_LOGOUT;
}
export interface OnBlockUserSuccessAction {
  type: AuthActionTypes.ON_BLOCK_USER_SUCCESS;
  blockedUser: IBlockedUser;
}
export interface OnUnblockUserSuccessAction {
  type: AuthActionTypes.ON_UNBLOCK_USER_SUCCESS;
  userToUnblockId: string;
}
export interface OnEditUserDataAction {
  type: AuthActionTypes.ON_EDIT_USER_DATA;
  user: IEditUserData;
}
export interface OnUploadNewProfilePhotoSuccessAction {
  type: AuthActionTypes.ON_UPLOAD_NEW_PROFILE_PHOTO_SUCCESS;
  newPhoto: string;
}
export interface OnRemoveProfilePhotoSuccessAction {
  type: AuthActionTypes.ON_REMOVE_PROFILE_PHOTO_SUCCESS;
}
export interface OnDeactivateAccountSuccessAction {
  type: AuthActionTypes.ON_DEACTIVATE_ACCOUNT_SUCCESS;
}
export interface OnDeleteAccountSuccessAction {
  type: AuthActionTypes.ON_DELETE_ACCOUNT_SUCCESS;
}
export interface OnRemoveProfilePhotoSuccessAction {
  type: AuthActionTypes.ON_REMOVE_PROFILE_PHOTO_SUCCESS;
}
export interface OnResetBlockStateAction {
  type: AuthActionTypes.RESET_BLOCK_STATE;
}

export type AuthAction = (
  OnAuthStartAction |
  OnAuthFailAction |
  OnClearAuthErrorAction |
  OnAuthSuccessAction |
  OnLogoutAction |
  OnBlockUserSuccessAction |
  OnUnblockUserSuccessAction |
  OnEditUserDataAction |
  OnUploadNewProfilePhotoSuccessAction |
  OnRemoveProfilePhotoSuccessAction |
  OnDeactivateAccountSuccessAction |
  OnDeleteAccountSuccessAction |
  OnResetBlockStateAction
);

// Response Types
export interface IAuthSuccessResponse {
  status: string;
  token:string;
  user: IAuthUser;
}

export interface IBlockUserSuccessResponse {
  status: string; 
  blockedUser: IBlockedUser
}

export interface IEditUserDataResponse {
  status: string;
  user: IEditUserData;
}

export interface IUploadNewProfilePhotoResponse {
  status: string;
  newPhoto: string;
}