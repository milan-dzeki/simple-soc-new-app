import { ActiveUserActionTypes, IActiveUser, OnGetActiveUsersAction, OnRemoveActiveUserAction } from '../types/activeUsers';

export const getActiveUsers = (activeUsers: IActiveUser[]): OnGetActiveUsersAction => {
  return {
    type: ActiveUserActionTypes.ON_GET_ACTIVE_USERS,
    activeUsers
  };
};

export const removeActiveUser = (userId: string): OnRemoveActiveUserAction => {
  return {
    type: ActiveUserActionTypes.ON_REMOVE_ACTIVE_USER,
    userId
  };
};