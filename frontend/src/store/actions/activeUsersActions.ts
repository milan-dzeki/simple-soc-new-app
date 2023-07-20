import { ActiveUserActionTypes, IActiveUser, OnGetActiveUsersAction } from '../types/activeUsers';

export const getActiveUsers = (activeUsers: IActiveUser[]): OnGetActiveUsersAction => {
  return {
    type: ActiveUserActionTypes.ON_GET_ACTIVE_USERS,
    activeUsers
  };
};