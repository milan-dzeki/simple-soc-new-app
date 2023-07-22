import { ActiveUserActionTypes, IActiveUser, ActiveUsersAction } from "../types/activeUsers";

const initState: IActiveUser[] = [];

const reducer = (state = initState, action: ActiveUsersAction): IActiveUser[] => {
  switch(action.type) {
    case ActiveUserActionTypes.ON_GET_ACTIVE_USERS:
      return action.activeUsers;
    case ActiveUserActionTypes.ON_REMOVE_ACTIVE_USER:
      return state.filter(user => user.userId !== action.userId);
    default:
      return state;
  }
};

export default reducer;