import { Dispatch } from "redux";
import axiosAuth from "../../axios/axiosAuth";
import {
  IAuthUser,
  IAuthSuccessResponse,
  IBlockUserSuccessResponse,
  AuthActionTypes, 
  AuthAction, 
  OnAuthStartAction,
  OnAuthFailAction,
  OnAuthSuccessAction,
  OnLogoutAction,
  OnClearAuthErrorAction,
  OnBlockUserSuccessAction,
  IBlockedUser,
  OnEditUserDataAction,
  IEditUserData,
  ISendEditUserData,
  IEditUserDataResponse,
  OnUploadNewProfilePhotoSuccessAction,
  IUploadNewProfilePhotoResponse,
  OnRemoveProfilePhotoSuccessAction,
  OnUnblockUserSuccessAction,
  OnResetBlockStateAction,
  OnDeleteAccountSuccessAction,
} from "../types/authTypes";
import axiosUser from "../../axios/axiosUser";
import socket from "../../socketIo";

const authStart = (): OnAuthStartAction => {
  return { type: AuthActionTypes.ON_AUTH_START };
};

const authFail = (errorMsg: string): OnAuthFailAction => {
  return { 
    type: AuthActionTypes.ON_AUTH_FAIL,
    errorMsg
  };
};

export const onClearAuthError = (): OnClearAuthErrorAction => {
  return { type: AuthActionTypes.ON_CLEAR_AUTH_ERROR };
};

const authSuccess = (token: string, user: IAuthUser): OnAuthSuccessAction => {
  socket.emit("addActiveUser", {userId: user._id});
  return {
    type: AuthActionTypes.ON_AUTH_SUCCESS,
    token,
    user
  };
};

export const signup = (providedData: FormData) => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    dispatch(authStart());

    try {
      const { data } = await axiosAuth.post<IAuthSuccessResponse>("/signup", providedData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch(authSuccess(data.token, data.user));
      localStorage.setItem("socNetAppToken", data.token);
    } catch(error) {
      dispatch(authFail((error as any).response.data.message));
    }
  };
};

export const login = (providedData: {email: string; password: string}) => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    dispatch(authStart());

    try {
      const { data } = await axiosAuth.post<IAuthSuccessResponse>("/login", providedData);
      dispatch(authSuccess(data.token, data.user));
      localStorage.setItem("socNetAppToken", data.token);
    } catch(error) {
      dispatch(authFail((error as any).response.data.message));
    }
  };
};

export const logout = (): OnLogoutAction => {
  localStorage.removeItem("socNetAppToken");
  
  return { type: AuthActionTypes.ON_LOGOUT };
};

export const isLoggedIn = () => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(authStart());

    if(!token) {
      dispatch(logout());
      return;
    }

    try {
      const { data } = await axiosAuth.post<IAuthSuccessResponse>("/isLoggedIn", {token});
      dispatch(authSuccess(data.token, data.user));
    } catch(error) {
      dispatch(logout());
      return;
    }
  };
};

const blockUserSuccess = (blockedUser: IBlockedUser): OnBlockUserSuccessAction => {
  return {
    type: AuthActionTypes.ON_BLOCK_USER_SUCCESS,
    blockedUser
  };
};

export const blockUser = (userToBlockId: string, relationToUser: "friends" | "sentPendingRequests" | "receivedPendingRequests" | "none") => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(authStart());

    try {
      const { data } = await axiosUser.post<IBlockUserSuccessResponse>("/block", {userId: userToBlockId, relationToUser}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(blockUserSuccess(data.blockedUser));
    } catch(error) {
      dispatch(authFail((error as any).response.data.message));
    }
  };
};

const unblockUserSuccess = (userToUnblockId: string): OnUnblockUserSuccessAction => {
  return {
    type: AuthActionTypes.ON_UNBLOCK_USER_SUCCESS,
    userToUnblockId
  };
};

export const unblockUser = (userToUnblockId: string) => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(authStart());

    try {
      await axiosUser.post("/unblock", {userId: userToUnblockId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(unblockUserSuccess(userToUnblockId));
    } catch(error) {
      dispatch(authFail((error as any).response.data.message));
    }
  };
};

export const resetBlockState = (): OnResetBlockStateAction => ({ type: AuthActionTypes.RESET_BLOCK_STATE });

const editUserDataSuccess = (user: IEditUserData): OnEditUserDataAction => {
  return {
    type: AuthActionTypes.ON_EDIT_USER_DATA,
    user
  };
};

export const editUserData = (dataToSend: ISendEditUserData) => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(authStart());

    try {
      const { data } = await axiosUser.patch<IEditUserDataResponse>("/editUserData", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      dispatch(editUserDataSuccess(data.user));
    } catch(error) {
      dispatch(authFail((error as any).response.data.message));
    }
  };
};

const uploadNewProfilePhotoSuccess = (newPhoto: string): OnUploadNewProfilePhotoSuccessAction => {
  return {
    type: AuthActionTypes.ON_UPLOAD_NEW_PROFILE_PHOTO_SUCCESS,
    newPhoto
  };
};

export const uploadNewProfilePhoto = (photo: FormData) => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(authStart());

    try {
      const { data } = await axiosUser.post<IUploadNewProfilePhotoResponse>("/uploadNewProfilePhoto", photo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch(uploadNewProfilePhotoSuccess(data.newPhoto));
    } catch(error) {
      dispatch(authFail((error as any).response.data.message));
    }
  };
};

const removeProfilePhotoSuccess = (): OnRemoveProfilePhotoSuccessAction => ({ type: AuthActionTypes.ON_REMOVE_PROFILE_PHOTO_SUCCESS });

export const removeProfilePhoto = () => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(authStart());

    try {
      await axiosUser.delete("/removeProfilePhoto", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(removeProfilePhotoSuccess());
    } catch(error) {
      dispatch(authFail((error as any).response.data.message));
    }
  }
};

const deleteAccountSuccess = (): OnDeleteAccountSuccessAction => ({ type: AuthActionTypes.ON_DELETE_ACCOUNT_SUCCESS });

export const deleteAccount = () => {
  return async(dispatch: Dispatch<AuthAction>): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    dispatch(authStart());

    try {
      await axiosAuth.delete("/deleteAccount", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(deleteAccountSuccess());
    } catch(error) {
      dispatch(authFail((error as any).response.data.message));
    }
  };
};

