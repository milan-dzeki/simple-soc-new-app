import { combineReducers } from "redux";
import authReducer from './authReducer';
import friendsReducer from './friendsReducer';
import activeUsersReducer from './activeUsersReducer';
import notificationsReducer from './notificationsReducer';
import chatsReducer from './chatsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  friends: friendsReducer,
  activeUsers: activeUsersReducer,
  notifications: notificationsReducer,
  chats: chatsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;