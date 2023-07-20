import { Dispatch } from 'redux';
import axiosChat from '../../axios/axiosChat';
import { ChatActionTypes, ChatsAction, IChat, IChatLastMsg, OnChatActionFail, OnChatActionStart, OnGetChatsSuccessAction, OnGetUnreadChatCountSuccessAction, OnMarkMessagesAsSeenSuccess, OnReceiveMessageSuccess, OnReceiveMessageWhileNotOnChatsPageSuccess, OnSendMessageSuccess, OnUserSeenMyMsgs } from "../types/chatsTypes";
import socket from '../../socketIo';

const chatsStartAction = (): OnChatActionStart => {
  return { type: ChatActionTypes.ON_CHAT_START_ACTION };
};

const chatsFailAction = (errorMsg: string): OnChatActionFail => {
  return {
    type: ChatActionTypes.ON_CHAT_FAIL_ACTION,
    errorMsg
  };
};

const getUnreadChatsCountSuccess = (unreadChatsCount: number): OnGetUnreadChatCountSuccessAction => {
  return {
    type: ChatActionTypes.ON_GET_UNREAD_CHAT_COUNT_SUCCESS,
    unreadChatsCount
  };
};

export const getUnreadChatsCount = () => {
  return async(dispatch: Dispatch<ChatsAction>): Promise<void> => {
    dispatch(chatsStartAction());
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosChat.get<{status: string; unreadChatsCount: number}>("/unreadChats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(data);
      dispatch(getUnreadChatsCountSuccess(data.unreadChatsCount));
    } catch(error) {
      dispatch(chatsFailAction((error as any).response.data.message));
    }
  }; 
};

const getChatsSuccess = (chats: IChat[]): OnGetChatsSuccessAction => {
  return {
    type: ChatActionTypes.ON_GET_CHATS_SUCCESS,
    chats
  };
};

export const getChats = () => {
  return async(dispatch: Dispatch<ChatsAction>): Promise<void> => {
    dispatch(chatsStartAction());
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosChat.get<{status: string; chats: IChat[]}>("/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(getChatsSuccess(data.chats));
    } catch(error) {
      dispatch(chatsFailAction((error as any).response.data.message));
    }
  };
};

export const sendMessageSuccess = (chatId: string, newLastMessage: IChatLastMsg, receiverId: string): OnSendMessageSuccess => {
  return {
    type: ChatActionTypes.ON_SEND_MESSAGE_SUCCESS,
    chatId,
    newLastMessage,
    receiverId
  };
};

export const receiveMessageSuccess = (chatId: string, newLastMessage: IChatLastMsg, receiverId: string): OnReceiveMessageSuccess => {
  return {
    type: ChatActionTypes.ON_RECEIVE_MESSAGE_SUCCESS,
    chatId,
    newLastMessage,
    receiverId
  };
};

export const receiveMessageWhileNotOnChatsPageSuccess = (chatId: string): OnReceiveMessageWhileNotOnChatsPageSuccess => {
  return {
    type: ChatActionTypes.ON_RECEIVE_MESSAGE_WHILE_NOT_ON_CHATS_PAGE_SUCCESS,
    chatId
  };
};

export const markMessagesAsSeenSuccess = (chatId: string,newUnreadMsgsList: string[], userId: string, hasLastMsg: boolean) : OnMarkMessagesAsSeenSuccess => {
  return {
    type: ChatActionTypes.ON_MARK_MESSAGES_AS_SEEN_SUCCESS,
    chatId,
    newUnreadMsgsList,
    userId,
    hasLastMsg
  };
};

export const userSeenMyMsgs = (userId: string, chatId: string, newUnreadMsgsList: string[], hasLastMsg: boolean): OnUserSeenMyMsgs => {
  return {
    type: ChatActionTypes.ON_USER_SSEN_MY_MSGS,
    userId,
    chatId,
    newUnreadMsgsList,
    hasLastMsg
  };
};

