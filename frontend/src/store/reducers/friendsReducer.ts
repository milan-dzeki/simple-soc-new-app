import { IFriendsState, FriendsAction, FriendsActionTypes } from "../types/friendsTypes";

const initState: IFriendsState = {
  friendsLoading: false,
  friendsErrorMsg: null,
  friends: [],
  sentPendingRequests: [],
  receivedPendingRequests: [],
  requestStatus: "idle"
};

const reducer = (state = initState, action: FriendsAction): IFriendsState => {
  switch(action.type) {
    case FriendsActionTypes.ON_FRIENDS_ACTION_START:
      return {
        ...state,
        friendsLoading: true
      };
    case FriendsActionTypes.ON_FRIENDS_ACTION_FAIL:
      return {
        ...state,
        friendsLoading: false,
        friendsErrorMsg: action.errorMsg
      };
    case FriendsActionTypes.ON_CLEAR_FRIENDS_ERROR:
      return {
        ...state,
        friendsErrorMsg: null
      };
    case FriendsActionTypes.ON_GET_FRIENDS_SUCCESS:
      return {
        ...state,
        friendsLoading: false,
        receivedPendingRequests: action.friends.receivedPendingRequests,
        sentPendingRequests: action.friends.sentPendingRequests,
        friends: action.friends.friends
      };
    case FriendsActionTypes.ON_SEND_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        friendsLoading: false,
        sentPendingRequests: state.sentPendingRequests.concat(action.userRequested),
        requestStatus: "requested"
      };
    case FriendsActionTypes.ON_UNSEND_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        friendsLoading: false,
        sentPendingRequests: state.sentPendingRequests.filter(user => user.user._id !== action.userId),
        requestStatus: "unsent"
      };
    case FriendsActionTypes.ON_ACCEPT_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        friendsLoading: false,
        receivedPendingRequests: state.receivedPendingRequests.filter(user => user.user._id !== action.user.user._id),
        friends: [
          action.user,
          ...state.friends
        ],
        requestStatus: "accepted"
      };
    case FriendsActionTypes.ON_DECLINE_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        friendsLoading: false,
        receivedPendingRequests: state.receivedPendingRequests.filter(user => user.user._id !== action.userId),
        requestStatus: "declined"
      };
    case FriendsActionTypes.ON_UNFRIEND_SUCCESS:
      const newFriendList = state.friends.filter(user => user.user._id !== action.userId);
      const updated = newFriendList.map(friend => {
        const newMutualList = friend.mutualFriends.filter(mut => mut !== action.userId);
        return {
          ...friend,
          mutualFriends: newMutualList
        };
      });
      return {
        ...state,
        friendsLoading: false,
        requestStatus: "unfriended",
        friends: updated
      };
    case FriendsActionTypes.ON_RECEIVE_FRIEND_REQUEST_LIVE:
      return {
        ...state,
        receivedPendingRequests: [
          action.user,
          ...state.receivedPendingRequests
        ]
      };
    case FriendsActionTypes.ON_FRIEND_REQUEST_WITHDRAWN_LIVE:
      return {
        ...state,
        receivedPendingRequests: state.receivedPendingRequests.filter(user => user.user._id !== action.userId)
      };
    case FriendsActionTypes.ON_FRIEND_REQUEST_ACCEPTED_LIVE:
      return {
        ...state,
        sentPendingRequests: state.sentPendingRequests.filter(user => user.user._id !== action.user.user._id),
        friends: [
          action.user,
          ...state.friends
        ]
      };
    case FriendsActionTypes.ON_UNFRIENDED_LIVE:
      return {
        ...state,
        friends: state.friends.filter(user => user.user._id !== action.userId)
      };
    case FriendsActionTypes.ON_RESET_REQUEST_STATUS:
      return {
        ...state,
        requestStatus: "idle"
      };
    default:
      return state;
  }
};

export default reducer;