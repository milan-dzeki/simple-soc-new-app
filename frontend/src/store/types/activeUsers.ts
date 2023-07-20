// export interface IActiveUser {
//   socketId: string;
//   userId: string;
// }
export interface IActiveUser {
  socketIds: string[];
  userId: string;
}

export enum ActiveUserActionTypes {
  ON_GET_ACTIVE_USERS = "ON_GET_ACTIVE_USERS"
}

export interface OnGetActiveUsersAction {
  type: ActiveUserActionTypes.ON_GET_ACTIVE_USERS;
  activeUsers: IActiveUser[];
}

export type ActiveUsersAction = OnGetActiveUsersAction;