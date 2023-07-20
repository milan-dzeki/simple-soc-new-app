export interface IFriend {
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  mutualFriends: string[];
  whoCanMessageUser?: "everyone" | "friends" | "friendsOfFriends";
}

export interface IFriendsState {
  friendsLoading: boolean;
  friendsErrorMsg: string | null;
  friends: IFriend[];
  receivedPendingRequests: IFriend[];
  sentPendingRequests: IFriend[];
  requestStatus: "idle" | "requested" | "declined" |"unsent" | "accepted" | "unfriended";
}

export enum FriendsActionTypes {
  ON_FRIENDS_ACTION_START = "ON_FRIENDS_ACTION_START",
  ON_FRIENDS_ACTION_FAIL = "ON_FRIENDS_ACTION_FAIL",
  ON_CLEAR_FRIENDS_ERROR = "ON_CLEAR_FRIENDS_ERROR",
  ON_GET_FRIENDS_SUCCESS = "ON_GET_FRIENDS_SUCCESS",
  ON_SEND_FRIEND_REQUEST_SUCCESS = "ON_SEND_FRIEND_REQUEST_SUCCESS",
  ON_UNSEND_FRIEND_REQUEST_SUCCESS = "ON_UNSEND_FRIEND_REQUEST_SUCCESS",
  ON_ACCEPT_FRIEND_REQUEST_SUCCESS = "ON_ACCEPT_FRIEND_REQUEST_SUCCESS",
  ON_DECLINE_FRIEND_REQUEST_SUCCESS = "ON_DECLINE_FRIEND_REQUEST_SUCCESS",
  ON_UNFRIEND_SUCCESS = "ON_UNFRIEND_SUCCESS",
  ON_RECEIVE_FRIEND_REQUEST_LIVE = "ON_RECEIVE_FRIEND_REQUEST_LIVE",
  ON_FRIEND_REQUEST_WITHDRAWN_LIVE = "ON_FRIEND_REQUEST_WITHDRAWN_LIVE",
  ON_FRIEND_REQUEST_ACCEPTED_LIVE = "ON_FRIEND_REQUEST_ACCEPTED_LIVE",
  ON_UNFRIENDED_LIVE = "ON_UNFRIENDED_LIVE",
  ON_RESET_REQUEST_STATUS = "ON_RESET_REQUEST_STATUS"
}

export interface OnFriendsStartAction {
  type: FriendsActionTypes.ON_FRIENDS_ACTION_START;
}
export interface OnFriendsFailAction {
  type: FriendsActionTypes.ON_FRIENDS_ACTION_FAIL;
  errorMsg: string;
}
export interface OnClearFriendsErrorAction {
  type: FriendsActionTypes.ON_CLEAR_FRIENDS_ERROR;
}
export interface OnGetFriendsSuccessAction {
  type: FriendsActionTypes.ON_GET_FRIENDS_SUCCESS;
  friends: {
    friends: IFriend[];
    receivedPendingRequests: IFriend[];
    sentPendingRequests: IFriend[];
  };
}
export interface OnSendFriendRequestSuccessAction {
  type: FriendsActionTypes.ON_SEND_FRIEND_REQUEST_SUCCESS;
  userRequested: IFriend;
}
export interface OnUnsendFriendRequestSuccessAction {
  type: FriendsActionTypes.ON_UNSEND_FRIEND_REQUEST_SUCCESS;
  userId: string;
}
export interface OnAcceptFriendRequestSuccessAction {
  type: FriendsActionTypes.ON_ACCEPT_FRIEND_REQUEST_SUCCESS;
  user: IFriend;
}
export interface OnDeclineFriendRequestSuccessAction {
  type: FriendsActionTypes.ON_DECLINE_FRIEND_REQUEST_SUCCESS;
  userId: string;
}
export interface OnUnfriendSuccessAction {
  type: FriendsActionTypes.ON_UNFRIEND_SUCCESS;
  userId: string;
}
export interface OnResetRequestStatusAction {
  type: FriendsActionTypes.ON_RESET_REQUEST_STATUS;
}
export interface OnReceiveFriendRequestLiveAction {
  type: FriendsActionTypes.ON_RECEIVE_FRIEND_REQUEST_LIVE;
  user: IFriend;
}
export interface OnFriendRequestWithdrawnLiveAction {
  type: FriendsActionTypes.ON_FRIEND_REQUEST_WITHDRAWN_LIVE;
  userId: string;
}
export interface OnFriendRequestAcceptedLiveAction {
  type: FriendsActionTypes.ON_FRIEND_REQUEST_ACCEPTED_LIVE;
  user: IFriend;
}
export interface OnUnfriendedLiveAction {
  type: FriendsActionTypes.ON_UNFRIENDED_LIVE;
  userId: string;
}

export type FriendsAction = (
  OnFriendsStartAction |
  OnFriendsFailAction |
  OnClearFriendsErrorAction |
  OnGetFriendsSuccessAction |
  OnSendFriendRequestSuccessAction |
  OnUnsendFriendRequestSuccessAction |
  OnAcceptFriendRequestSuccessAction |
  OnDeclineFriendRequestSuccessAction |
  OnUnfriendSuccessAction |
  OnReceiveFriendRequestLiveAction |
  OnFriendRequestWithdrawnLiveAction |
  OnFriendRequestAcceptedLiveAction |
  OnUnfriendedLiveAction |
  OnResetRequestStatusAction
);