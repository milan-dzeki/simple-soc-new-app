// export interface IActiveUser {
//   socketId: string;
//   userId: string;
// }
export interface IActiveUser {
  socketIds: string[];
  userId: string;
}

export enum ActiveUserActionTypes {
  ON_GET_ACTIVE_USERS = "ON_GET_ACTIVE_USERS",
  ON_REMOVE_ACTIVE_USER = "ON_REMOVE_ACTIVE_USER"
}

export interface OnGetActiveUsersAction {
  type: ActiveUserActionTypes.ON_GET_ACTIVE_USERS;
  activeUsers: IActiveUser[];
}
export interface OnRemoveActiveUserAction {
  type: ActiveUserActionTypes.ON_REMOVE_ACTIVE_USER;
  userId: string;
}

export type ActiveUsersAction = (
  OnGetActiveUsersAction |
  OnRemoveActiveUserAction
);