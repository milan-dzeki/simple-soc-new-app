import { IAuthState, AuthAction, AuthActionTypes } from "../types/authTypes";

const intiState: IAuthState = {
  initLoading: true,
  authLoading: true,
  authErrorMsg: null,
  token: null,
  authUser: null,
  userJustBlocked: false
};

const reducer = (state = intiState, action: AuthAction): IAuthState => {
  switch(action.type) {
    case AuthActionTypes.ON_AUTH_START:
      return {
        ...state,
        authLoading: true
      };
    case AuthActionTypes.ON_AUTH_FAIL:
      return {
        ...state,
        initLoading: false,
        authLoading: false,
        authErrorMsg: action.errorMsg
      };
    case AuthActionTypes.ON_CLEAR_AUTH_ERROR:
      return {
        ...state,
        authErrorMsg: null
      };
    case AuthActionTypes.ON_AUTH_SUCCESS:
      return {
        ...state,
        initLoading: false,
        authLoading: false,
        token: action.token,
        authUser: action.user
      };
    case AuthActionTypes.ON_LOGOUT:
      return {
        ...state,
        initLoading: false,
        authLoading: false,
        authErrorMsg: null,
        token: null,
        authUser: null
      };
    case AuthActionTypes.ON_BLOCK_USER_SUCCESS:
      return {
        ...state,
        initLoading: false,
        authLoading: false,
        authUser: {
          ...state.authUser!,
          blockList: state.authUser!.blockList.concat(action.blockedUser)
        },
        userJustBlocked: true
      };
    case AuthActionTypes.ON_UNBLOCK_USER_SUCCESS:
      return {
        ...state,
        initLoading: false,
        authLoading: false,
        authUser: {
          ...state.authUser!,
          blockList: state.authUser!.blockList.filter(user => user._id !== action.userToUnblockId)
        }
      };
    case AuthActionTypes.RESET_BLOCK_STATE:
      return {
        ...state,
        userJustBlocked: false
      };
    case AuthActionTypes.ON_EDIT_USER_DATA:
      return {
        ...state,
        authLoading: false,
        authUser: {
          ...state.authUser!,
          firstName: action.user.firstName,
          lastName: action.user.lastName,
          fullName: action.user.fullName,
          email: action.user.email,
          gender: action.user.gender,
          dateOfBirth: action.user.dateOfBirth
        }
      };
    case AuthActionTypes.ON_UPLOAD_NEW_PROFILE_PHOTO_SUCCESS:
      return {
        ...state,
        authLoading: false,
        authUser: {
          ...state.authUser!,
          profilePhotoUrl: action.newPhoto
        }
      };
    case AuthActionTypes.ON_REMOVE_PROFILE_PHOTO_SUCCESS:
      return {
        ...state,
        authLoading: false,
        authUser: {
          ...state.authUser!,
          profilePhotoUrl: ""
        }
      };
    case AuthActionTypes.ON_DELETE_ACCOUNT_SUCCESS:
      return {
        ...state,
        // initLoading: false,
        authLoading: false,
        // authUser: null,
        // token: null
      };
    default:
      return state;
  }
};

export default reducer;