export interface INotification {
  _id: string;
  user: string;
  notificationType: "receivedFriendRequest" | "acceptedFriendRequest" | "userLikedYourPost" | "userCommentedOnYourPost" | "userPostedOnYourWall" | "userTaggedYouInPost" | "userTaggedYouInCommentOnPost" | "userTaggedYouInCommentOnPhoto" | "userLikedYourCommentOnPost" | "userLikedYourCommentOnPhoto" | "userLikedYourPhoto" | "userCommentedOnYourPhoto" | "userTaggedYouInPhoto";
  status: "unread" | "read";
  fromUser: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  text: string;
  postId?: string;
  albumId?: string;
  photoId?: string;
  commentId?: string;
  createdAt: Date;
}

export interface INotificationState {
  notifLoading: boolean;
  notifErrorMsg: string | null;
  unreadNotificationsCount: number;
  notifications: INotification[];
}

export enum NotificationActionTypes {
  ON_NOTIF_ACTION_START = "ON_NOTIF_ACTION_START",
  ON_NOTIF_ACTION_FAIL = "ON_NOTIF_ACTION_FAIL",
  ON_CLEAR_NOTIF_ERROR = "ON_CLEAR_NOTIF_ERROR",
  ON_GET_NOTIF_SUCCESS = "ON_GET_NOTIF_SUCCESS",
  ON_GET_UNREAD_NOTIFS_COUNT = "ON_GET_UNREAD_NOTIFS_COUNT",
  ON_RECEIVE_LIVE_NOTIFICATION = "ON_RECEIVE_LIVE_NOTIFICATION",
  ON_MARK_NOTIF_AS_READ = "ON_MARK_NOTIF_AS_READ",
  ON_MARK_NOTIF_AS_UNREAD = "ON_MARK_NOTIF_AS_UNREAD",
  ON_DELETE_NOTIF_SUCCESS = "ON_DELETE_NOTIF_SUCCESS",
  ON_EDIT_NOTIF_SUCCESS = "ON_EDIT_NOTIF_SUCCESS",
  ON_REMOVE_FRIEND_REQ_NOTIF_AFTER_CANCEL_LIVE = "ON_REMOVE_FRIEND_REQ_NOTIF_AFTER_CANCEL_LIVE"
}

export interface OnNotifActionStartAction {
  type: NotificationActionTypes.ON_NOTIF_ACTION_START;
}
export interface OnNotifActionFailAction {
  type: NotificationActionTypes.ON_NOTIF_ACTION_FAIL;
  errorMsg: string;
}
export interface OnClearNotifErrorAction {
  type: NotificationActionTypes.ON_CLEAR_NOTIF_ERROR;
}
export interface OnGetUnreadNotifsCountAction {
  type: NotificationActionTypes.ON_GET_UNREAD_NOTIFS_COUNT,
  count: number;
}
export interface OnReceiveLiveNotificationAction {
  type: NotificationActionTypes.ON_RECEIVE_LIVE_NOTIFICATION;
  notification: INotification;
}
export interface OnGetNotifSuccessAction {
  type: NotificationActionTypes.ON_GET_NOTIF_SUCCESS;
  notifications: INotification[];
}
export interface OnMarkNotifAsReadAction {
  type: NotificationActionTypes.ON_MARK_NOTIF_AS_READ;
  notifId: string;
}
export interface OnMarkNotifAsUnreadAction {
  type: NotificationActionTypes.ON_MARK_NOTIF_AS_UNREAD;
  notifId: string;
}
export interface OnDeleteNotifSuccessAction {
  type: NotificationActionTypes.ON_DELETE_NOTIF_SUCCESS;
  notifId: string;
  notifStatus: "unread" | "read";
}
export interface OnEditNotifSuccessAction {
  type: NotificationActionTypes.ON_EDIT_NOTIF_SUCCESS;
  notifId: string;
}
export interface OnRemoveFriendReqNotifAfterCancelLiveAction {
  type: NotificationActionTypes.ON_REMOVE_FRIEND_REQ_NOTIF_AFTER_CANCEL_LIVE;
  userId: string;
}

export type NotificationAction = (
  OnNotifActionStartAction |
  OnNotifActionFailAction |
  OnClearNotifErrorAction |
  OnGetUnreadNotifsCountAction |
  OnReceiveLiveNotificationAction |
  OnGetNotifSuccessAction |
  OnMarkNotifAsReadAction |
  OnMarkNotifAsUnreadAction |
  OnDeleteNotifSuccessAction |
  OnEditNotifSuccessAction |
  OnRemoveFriendReqNotifAfterCancelLiveAction
);