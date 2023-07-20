import { Dispatch } from "redux";
import { 
  FriendsActionTypes, 
  FriendsAction, 
  OnFriendsStartAction, 
  OnFriendsFailAction,
  OnClearFriendsErrorAction,
  OnSendFriendRequestSuccessAction,
  IFriend,
  OnUnsendFriendRequestSuccessAction,
  OnDeclineFriendRequestSuccessAction,
  OnAcceptFriendRequestSuccessAction,
  OnResetRequestStatusAction,
  OnUnfriendSuccessAction,
  OnGetFriendsSuccessAction,
  OnReceiveFriendRequestLiveAction,
  OnFriendRequestWithdrawnLiveAction,
  OnFriendRequestAcceptedLiveAction,
  OnUnfriendedLiveAction
} from "../types/friendsTypes";
import axiosFriends from "../../axios/axiosFriends";
import socket from "../../socketIo";

const friendsActionStart = (): OnFriendsStartAction => {
  return { type: FriendsActionTypes.ON_FRIENDS_ACTION_START };
};

const friendsActionFail = (errorMsg: string): OnFriendsFailAction => {
  return {
    type: FriendsActionTypes.ON_FRIENDS_ACTION_FAIL,
    errorMsg
  };
};

export const clearFriendsError = (): OnClearFriendsErrorAction => {
  return { type: FriendsActionTypes.ON_CLEAR_FRIENDS_ERROR };
};

export const resetRequestStatus = (): OnResetRequestStatusAction => {
  return { type: FriendsActionTypes.ON_RESET_REQUEST_STATUS };
};

const getFriendsSuccess = (friends: {
  friends: IFriend[];
  receivedPendingRequests: IFriend[];
  sentPendingRequests: IFriend[];
}): OnGetFriendsSuccessAction => {
  return {
    type: FriendsActionTypes.ON_GET_FRIENDS_SUCCESS,
    friends
  };
};

export const getFriends = () => {
  return async(dispatch: Dispatch<FriendsAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(friendsActionStart());

    try {
      const { data } = await axiosFriends.get<{status: string; friends: {friends: IFriend[]; receivedPendingRequests: IFriend[]; sentPendingRequests: IFriend[]}}>("/myFriends", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(data);
      dispatch(getFriendsSuccess(data.friends));
    } catch(error) {
      dispatch(friendsActionFail((error as any).response.data.message));
    }
  };
};

const sendFriendRequestSuccess = (userRequested: IFriend): OnSendFriendRequestSuccessAction => {
  return {
    type: FriendsActionTypes.ON_SEND_FRIEND_REQUEST_SUCCESS,
    userRequested
  };
};

export const sendFriendRequest = (userId: string) => {
  return async(dispatch: Dispatch<FriendsAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(friendsActionStart());

    try {
      const { data } = await axiosFriends.post("/sendRequest", {userId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(sendFriendRequestSuccess(data.user));

      if(data.userNotification) {
        socket.emit("sendFriendRequest", {notification: data.userNotification, user: {
          user: data.userNotification.fromUser,
          mutualFriends: data.user.mutualFriends,
          whoCanMessageUser: data.authUserWhoCanMessage
        }});
      }
    } catch(error) {
      dispatch(friendsActionFail((error as any).response.data.message));
    }
  };
};

const unsendFriendRequestSuccess = (userId: string): OnUnsendFriendRequestSuccessAction => {
  return {
    type: FriendsActionTypes.ON_UNSEND_FRIEND_REQUEST_SUCCESS,
    userId
  };
};

export const unsendFriendRequest = (userId: string) => {
  return async(dispatch: Dispatch<FriendsAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(friendsActionStart());

    try { 
      const { data } = await axiosFriends.post("/unsendRequest", {userId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(unsendFriendRequestSuccess(userId));

      if(data.authUserId) {
        socket.emit("unsendFriendRequest", {authUserId: data.authUserId, targetUserId: userId});
      }
    } catch(error) {
      dispatch(friendsActionFail((error as any).response.data.message));
    }
  };
};

const acceptFriendRequestSuccess = (user: IFriend): OnAcceptFriendRequestSuccessAction => {
  return {
    type: FriendsActionTypes.ON_ACCEPT_FRIEND_REQUEST_SUCCESS,
    user
  };
};

export const acceptFriendRequest = (userId: string) => {
  return async(dispatch: Dispatch<FriendsAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(friendsActionStart());

    try {
      const { data } = await axiosFriends.post("/acceptRequest", {userId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(acceptFriendRequestSuccess(data.user));

      if(data.userNotification) {
        socket.emit("acceptFriendRequest", {notification: data.userNotification, user: {
          user: data.userNotification.fromUser,
          mutualFriends: data.user.mutualFriends,
          whoCanMessageUser: data.authUserWhoCanMessage
        }});
      }
    } catch(error) {
      dispatch(friendsActionFail((error as any).response.data.message));
    }
  };
};

const declineFriendRequestSuccess = (userId: string): OnDeclineFriendRequestSuccessAction => {
  return {
    type: FriendsActionTypes.ON_DECLINE_FRIEND_REQUEST_SUCCESS,
    userId
  };
};

export const declineFriendRequest = (userId: string) => {
  return async(dispatch: Dispatch<FriendsAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(friendsActionStart());

    try {
      await axiosFriends.post("/declineRequest", {userId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(declineFriendRequestSuccess(userId));
    } catch(error) {
      dispatch(friendsActionFail((error as any).response.data.message));
    }
  };
};

const unfriendSuccess = (userId: string): OnUnfriendSuccessAction => {
  return {
    type: FriendsActionTypes.ON_UNFRIEND_SUCCESS,
    userId
  };
};

export const unfriend = (userId: string) => {
  return async(dispatch: Dispatch<FriendsAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(friendsActionStart());

    try {
      const { data } = await axiosFriends.post("/unfriend", {userId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(unfriendSuccess(userId));

      socket.emit("unfriend", {authUserId: data.authUserId, targetUserId: userId});
    } catch(error) {
      dispatch(friendsActionFail((error as any).response.data.message));
    }
  };
};

export const receiveFriendRequest = (user: IFriend): OnReceiveFriendRequestLiveAction => {
  return {
    type: FriendsActionTypes.ON_RECEIVE_FRIEND_REQUEST_LIVE,
    user
  };
};

export const friendRequestWithdrawn = (userId: string): OnFriendRequestWithdrawnLiveAction => {
  return {
    type: FriendsActionTypes.ON_FRIEND_REQUEST_WITHDRAWN_LIVE,
    userId
  };
};

export const friendRequestAccepted = (user: IFriend): OnFriendRequestAcceptedLiveAction => {
  return {
    type: FriendsActionTypes.ON_FRIEND_REQUEST_ACCEPTED_LIVE,
    user
  };
};

export const unfriended = (userId: string): OnUnfriendedLiveAction => {
  return {
    type: FriendsActionTypes.ON_UNFRIENDED_LIVE,
    userId
  };
};

