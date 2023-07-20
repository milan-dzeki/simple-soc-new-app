export interface IChatUser {
  _id: string;
  fullName: string;
  profilePhotoUrl: string;
}

export interface IChatUserLastSeen {
  _id: string;
  fullName: string;
  profilePhotoUrl: string;
  lastTimeSeen: Date;
}

export interface IMessage {
  _id: string;
  chatId: string;
  sender: IChatUser;
  receiver: IChatUser;
  text: string;
  photo: {
    secure_url: string;
    public_id: string;
  };
  edited: boolean;
  deleted: boolean;
  status: "delivered" | "seen";
  createdAt: Date;
}

export interface ISelectedChat {
  chatId: string;
  messages: IMessage[];
  photoMessages: IMessage[];
  user: IChatUserLastSeen;
  unreadMessages: string[];
}

export interface IChatLastMsg {
  originalMessageId: string;
  text: string;
  hasPhoto: boolean;
  sender: string;
  status: "delivered" | "seen";
  time: Date;
}

export interface IChat {
  _id: string;
  users: IChatUser[];
  chatCreator: string;
  unreadMessages: {
    user: string;
    messages: string[];
  }[];
  lastMessage: IChatLastMsg;
  chatEmpty: boolean;
  chatDeletedFor: string[];
}

export interface IChatsState {
  chatsLoading: boolean;
  chatsErrorMsg: string | null;
  chats: IChat[];
  unreadChatsCount: number;
}

export enum ChatActionTypes {
  ON_CHAT_START_ACTION = "ON_CHAT_START_ACTION",
  ON_CHAT_FAIL_ACTION = "ON_CHAT_FAIL_ACTION",
  ON_GET_CHATS_SUCCESS = "ON_GET_CHATS_SUCCESS",
  ON_GET_UNREAD_CHAT_COUNT_SUCCESS = "ON_GET_UNREAD_CHAT_COUNT_SUCCESS",
  ON_GET_SINGLE_CHAT_MESSAGES_SUCCESS = "ON_GET_SINGLE_CHAT_MESSAGES_SUCCESS",
  ON_CREATE_EMPTY_CHAT_SUCCESS = "ON_CREATE_EMPTY_CHAT_SUCCESS",
  ON_SEND_MESSAGE_SUCCESS = "ON_SEND_MESSAGE_SUCCESS",
  ON_RECEIVE_MESSAGE_SUCCESS = "ON_RECEIVE_MESSAGE_SUCCESS",
  ON_RECEIVE_MESSAGE_WHILE_NOT_ON_CHATS_PAGE_SUCCESS = "ON_RECEIVE_MESSAGE_WHILE_NOT_ON_CHATS_PAGE_SUCCESS",
  ON_EDIT_MESSAGE_SUCCESS = "ON_EDIT_MESSAGE_SUCCESS",
  ON_DELETE_MESSAGE_SUCCESS = "ON_DELETE_MESSAGE_SUCCESS",
  ON_MARK_MESSAGES_AS_SEEN_SUCCESS = "ON_MARK_MESSAGES_AS_SEEN_SUCCESS",
  ON_USER_SSEN_MY_MSGS = "ON_USER_SSEN_MY_MSGS",
  ON_DELETE_CHAT_SUCCESS = "ON_DELETE_CHAT_SUCCESS"
}

export interface OnChatActionStart {
  type: ChatActionTypes.ON_CHAT_START_ACTION;
}
export interface OnChatActionFail {
  type: ChatActionTypes.ON_CHAT_FAIL_ACTION;
  errorMsg: string;
}
export interface OnGetChatsSuccessAction {
  type: ChatActionTypes.ON_GET_CHATS_SUCCESS;
  chats: IChat[];
}
export interface OnGetUnreadChatCountSuccessAction {
  type: ChatActionTypes.ON_GET_UNREAD_CHAT_COUNT_SUCCESS;
  unreadChatsCount: number;
}
export interface OnGetSingleChatMessagesSuccess {
  type: ChatActionTypes.ON_GET_SINGLE_CHAT_MESSAGES_SUCCESS;
  user: IChatUser;
  messages: IMessage[];
}
export interface OnSendMessageSuccess {
  type: ChatActionTypes.ON_SEND_MESSAGE_SUCCESS;
  chatId: string;
  newLastMessage: IChatLastMsg;
  receiverId: string;
}
export interface OnReceiveMessageSuccess {
  type: ChatActionTypes.ON_RECEIVE_MESSAGE_SUCCESS;
  chatId: string;
  newLastMessage: IChatLastMsg;
  receiverId: string;
}
export interface OnReceiveMessageWhileNotOnChatsPageSuccess {
  type: ChatActionTypes.ON_RECEIVE_MESSAGE_WHILE_NOT_ON_CHATS_PAGE_SUCCESS;
  chatId: string;
}
export interface OnMarkMessagesAsSeenSuccess {
  type: ChatActionTypes.ON_MARK_MESSAGES_AS_SEEN_SUCCESS;
  chatId: string;
  userId: string;
  newUnreadMsgsList: string[];
  hasLastMsg: boolean;
}
export interface OnUserSeenMyMsgs {
  type: ChatActionTypes.ON_USER_SSEN_MY_MSGS;
  chatId: string;
  userId: string;
  newUnreadMsgsList: string[];
  hasLastMsg: boolean;
}

export type ChatsAction = (
  OnChatActionStart |
  OnChatActionFail |
  OnGetChatsSuccessAction |
  OnGetUnreadChatCountSuccessAction |
  OnGetSingleChatMessagesSuccess |
  OnSendMessageSuccess |
  OnReceiveMessageSuccess |
  OnReceiveMessageWhileNotOnChatsPageSuccess |
  OnMarkMessagesAsSeenSuccess |
  OnUserSeenMyMsgs
);