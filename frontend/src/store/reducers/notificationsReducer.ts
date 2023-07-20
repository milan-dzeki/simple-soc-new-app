import { INotificationState, NotificationActionTypes, NotificationAction } from "../types/notificationsTypes";

const initState: INotificationState = {
  notifLoading: false,
  notifErrorMsg: null,
  unreadNotificationsCount: 0,
  notifications: []
};

const reducer = (state = initState, action: NotificationAction): INotificationState => {
  switch(action.type) {
    case NotificationActionTypes.ON_NOTIF_ACTION_START:
      return {
        ...state,
        notifLoading: true
      };
    case NotificationActionTypes.ON_NOTIF_ACTION_FAIL:
      return {
        ...state,
        notifLoading: false,
        notifErrorMsg: action.errorMsg
      };
    case NotificationActionTypes.ON_CLEAR_NOTIF_ERROR:
      return {
        ...state,
        notifErrorMsg: null
      };
    case NotificationActionTypes.ON_GET_UNREAD_NOTIFS_COUNT:
      return {
        ...state,
        unreadNotificationsCount: action.count
      };
    case NotificationActionTypes.ON_GET_NOTIF_SUCCESS:
      return {
        ...state,
        notifLoading: false,
        notifications: action.notifications,
        unreadNotificationsCount: action.notifications.filter(notif => notif.status === "unread").length
      };
    case NotificationActionTypes.ON_RECEIVE_LIVE_NOTIFICATION:
      return{
        ...state,
        unreadNotificationsCount: state.unreadNotificationsCount + 1
      };
    case NotificationActionTypes.ON_MARK_NOTIF_AS_READ:
      const targetNotifIndex = state.notifications.findIndex(notif => notif._id === action.notifId);
      const copiedNotifs = [...state.notifications];
      if(targetNotifIndex !== -1) {
        copiedNotifs[targetNotifIndex].status = "read";
      }
      return {
        ...state,
        notifLoading: false,
        notifications: copiedNotifs,
        unreadNotificationsCount: state.unreadNotificationsCount - 1
      };
    case NotificationActionTypes.ON_MARK_NOTIF_AS_UNREAD:
      const targetNotifInd = state.notifications.findIndex(notif => notif._id === action.notifId);
      const copiedNotifics = [...state.notifications];
      if(targetNotifInd !== -1) {
        copiedNotifics[targetNotifInd].status = "unread";
      }
      return {
        ...state,
        notifLoading: false,
        notifications: copiedNotifics,
        unreadNotificationsCount: state.unreadNotificationsCount + 1
      };
    case NotificationActionTypes.ON_DELETE_NOTIF_SUCCESS:
      return {
        ...state,
        notifLoading: false,
        notifications: state.notifications.filter(notif => notif._id !== action.notifId),
        unreadNotificationsCount: action.notifStatus === "unread" ? state.unreadNotificationsCount - 1 : state.unreadNotificationsCount
      };
    default:
      return state;
  }
};

export default reducer;