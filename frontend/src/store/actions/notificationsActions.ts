import { Dispatch } from 'redux';
import axiosNotifs from '../../axios/axiosNotifs';
import { INotification, NotificationAction, NotificationActionTypes, OnClearNotifErrorAction, OnDeleteNotifSuccessAction, OnGetNotifSuccessAction, OnGetUnreadNotifsCountAction, OnMarkNotifAsReadAction, OnMarkNotifAsUnreadAction, OnNotifActionFailAction, OnNotifActionStartAction, OnReceiveLiveNotificationAction, OnRemoveFriendReqNotifAfterCancelLiveAction } from '../types/notificationsTypes';

const notifActionStart = (): OnNotifActionStartAction => {
  return { type: NotificationActionTypes.ON_NOTIF_ACTION_START };
};

const notifActionFail = (errorMsg: string): OnNotifActionFailAction => {
  return {
    type: NotificationActionTypes.ON_NOTIF_ACTION_FAIL,
    errorMsg
  };
};

export const clearNotifError = (): OnClearNotifErrorAction => ({ type: NotificationActionTypes.ON_CLEAR_NOTIF_ERROR });

const getNotifSuccess = (notifications: INotification[]): OnGetNotifSuccessAction => {
  return {
    type: NotificationActionTypes.ON_GET_NOTIF_SUCCESS,
    notifications
  };
};

const getUnreadNotifsCountSuccess = (count: number): OnGetUnreadNotifsCountAction => {
  return {
    type: NotificationActionTypes.ON_GET_UNREAD_NOTIFS_COUNT,
    count
  };
};

export const getUnreadNotifsCount = () => {
  return async(dispatch: Dispatch<NotificationAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosNotifs.get<{status: string; unreadNotificationsCount: number}>("/unreadCount", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(getUnreadNotifsCountSuccess(data.unreadNotificationsCount));
    } catch(error) {
      return;
    }
  };
};

export const getNotifications = () => {
  return async(dispatch: Dispatch<NotificationAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(notifActionStart());

    try {
      const { data } = await axiosNotifs.get<{status: string; notifications: INotification[]}>("/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(getNotifSuccess(data.notifications));
    } catch(error) {
      dispatch(notifActionFail((error as any).response.data.message));
    }
  };
};

export const receiveLiveNotification = (notification: INotification): OnReceiveLiveNotificationAction => {
  return {
    type: NotificationActionTypes.ON_RECEIVE_LIVE_NOTIFICATION,
    notification
  };
};

const markNotificationAsReadSuccess = (notifId: string): OnMarkNotifAsReadAction => {
  return {
    type: NotificationActionTypes.ON_MARK_NOTIF_AS_READ,
    notifId
  };
};

export const markNotificationAsRead = (notifId: string) => {
  return async(dispatch: Dispatch<NotificationAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    dispatch(notifActionStart());

    try {
      await axiosNotifs.post("/markAsRead", {notificationId: notifId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(markNotificationAsReadSuccess(notifId));
    } catch(error) {
      dispatch(notifActionFail((error as any).response.data.message));
    }
  };
};

const markNotificationAsUnreadSuccess = (notifId: string): OnMarkNotifAsUnreadAction => {
  return {
    type: NotificationActionTypes.ON_MARK_NOTIF_AS_UNREAD,
    notifId
  };
};

export const markNotificationAsUnread = (notifId: string) => {
  return async(dispatch: Dispatch<NotificationAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    dispatch(notifActionStart());

    try {
      await axiosNotifs.post("/markAsUnread", {notificationId: notifId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(markNotificationAsUnreadSuccess(notifId));
    } catch(error) {
      dispatch(notifActionFail((error as any).response.data.message));
    }
  };
};

const deleteNotificationSuccess = (notifId: string, notifStatus: "unread" | "read"): OnDeleteNotifSuccessAction => {
  return {
    type: NotificationActionTypes.ON_DELETE_NOTIF_SUCCESS,
    notifId,
    notifStatus
  };
};

export const deleteNotification = (notifId: string, notifStatus: "unread" | "read") => {
  return async(dispatch: Dispatch<NotificationAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    dispatch(notifActionStart());

    try {
      await axiosNotifs.delete(`/${notifId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(deleteNotificationSuccess(notifId, notifStatus));
    } catch(error) {
      dispatch(notifActionFail((error as any).response.data.message));
    }
  };
};

// export const removeFriendReqNotifAfterCancel = (userId: string): OnRemoveFriendReqNotifAfterCancelLiveAction => {

// };