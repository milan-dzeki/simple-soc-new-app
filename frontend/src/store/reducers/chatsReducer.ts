import { IChatsState, ChatsAction, ChatActionTypes } from "../types/chatsTypes";

const initState: IChatsState = {
  chatsLoading: false,
  chatsErrorMsg: null,
  chats: [],
  unreadChatsCount: 0
};

const reducer = (state = initState, action: ChatsAction): IChatsState => {
  switch(action.type) {
    case ChatActionTypes.ON_CHAT_START_ACTION:
      return {
        ...state,
        chatsLoading: true
      };
    case ChatActionTypes.ON_CHAT_FAIL_ACTION:
      return {
        ...state,
        chatsLoading: false,
        chatsErrorMsg: action.errorMsg
      };
    case ChatActionTypes.ON_GET_UNREAD_CHAT_COUNT_SUCCESS:
      return {
        ...state,
        chatsLoading: false,
        unreadChatsCount: action.unreadChatsCount
      };
    case ChatActionTypes.ON_GET_CHATS_SUCCESS:
      return {
        ...state,
        chatsLoading: false,
        chats: action.chats
      };
    case ChatActionTypes.ON_SEND_MESSAGE_SUCCESS:
      const targetChatIndex = state.chats.findIndex(chat => chat._id === action.chatId);
      const copiedChats = [...state.chats];
      if(targetChatIndex >= 0) {
        copiedChats[targetChatIndex].lastMessage = action.newLastMessage;

        const targetUserUnread = copiedChats[targetChatIndex].unreadMessages.findIndex(unr => unr.user === action.receiverId);
        
        if(targetUserUnread !== -1) {
          const newUnread = [...copiedChats[targetChatIndex].unreadMessages];
          newUnread[targetUserUnread].messages.push(action.newLastMessage.originalMessageId);
          copiedChats[targetChatIndex].unreadMessages = newUnread;
        }
      }
      return {
        ...state,
        chats: copiedChats
      };
    case ChatActionTypes.ON_RECEIVE_MESSAGE_SUCCESS:
      const targChatIndex = state.chats.findIndex(chat => chat._id === action.chatId);
      const copdChats = [...state.chats];
      if(targChatIndex >= 0) {
        copdChats[targChatIndex].lastMessage = action.newLastMessage;
        const targetUserUnr = copdChats[targChatIndex].unreadMessages.findIndex(unr => unr.user === action.receiverId);
        if(targetUserUnr !== -1) {
          const newUnread = [...copdChats[targChatIndex].unreadMessages];
          newUnread[targetUserUnr].messages.push(action.newLastMessage.originalMessageId);
          copdChats[targChatIndex].unreadMessages = newUnread;
        }
      }
      return {
        ...state,
        chats: copdChats
      };
    case ChatActionTypes.ON_RECEIVE_MESSAGE_WHILE_NOT_ON_CHATS_PAGE_SUCCESS:
      return {
        ...state,
        unreadChatsCount: state.unreadChatsCount + 1
      };
    case ChatActionTypes.ON_MARK_MESSAGES_AS_SEEN_SUCCESS:
      const targetChatInd = state.chats.findIndex(chat => chat._id === action.chatId);
      const copChats = [...state.chats];

      if(targetChatInd !== -1) {
        copChats[targetChatInd].lastMessage.status = "seen";
      }

      const unreadMsgsIndex = copChats[targetChatInd].unreadMessages.findIndex(msgs => msgs.user === action.userId);
      copChats[targetChatInd].unreadMessages[unreadMsgsIndex].messages = action.newUnreadMsgsList;
      if(action.hasLastMsg) {
        copChats[targetChatInd].lastMessage.status = "seen";
      }
      return {
        ...state,
        chats: copChats,
        unreadChatsCount: action.newUnreadMsgsList.length
      };
    case ChatActionTypes.ON_USER_SSEN_MY_MSGS:
      const chatsCopy = [...state.chats];
      const chatIndex = state.chats.findIndex(chat => chat._id === action.chatId);
      if(chatIndex !== -1) {
        if(action.hasLastMsg) {
          chatsCopy[chatIndex].lastMessage.status = "seen";

          const unreadMsgsIndex = chatsCopy[chatIndex].unreadMessages.findIndex(msgs => msgs.user === action.userId);
          chatsCopy[chatIndex].unreadMessages[unreadMsgsIndex].messages = action.newUnreadMsgsList;
        }
      }
      return {
        ...state,
        chats: chatsCopy
      };
    default:
      return state;
  }
};

export default reducer;