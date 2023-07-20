import { IUseSendMessageState, IUseSendMessageAction, IUseSendMessageActionTypes } from "./useSendMessageTypes";
import { sendMessageText } from "../../config/messaging/sendMessageText";

const reducer = (state: IUseSendMessageState, action: IUseSendMessageAction): IUseSendMessageState => {
  switch(action.type) {
    case IUseSendMessageActionTypes.ON_SEND_MESSAGE_START:
      return {
        ...state,
        sendMessageLoading: true
      };
    case IUseSendMessageActionTypes.ON_SEND_MESSAGE_FAIL:
      return {
        ...state,
        sendMessageLoading: false,
        sendMessageErrorMsg: action.errorMsg,
        sendMessageUserId: null,
        sendMessageUserName: null,
        sendMessageTextInput: {...sendMessageText},
        sendMessagePhoto: null,
        sendMessagePhotoPreview: null
      };
    case IUseSendMessageActionTypes.ON_CLEAR_SEND_MESSAGE_ERROR:
      return {
        ...state,
        sendMessageErrorMsg: null
      };
    case IUseSendMessageActionTypes.ON_OPEN_SEND_MESSAGE_MODAL:
      return {
        ...state,
        sendMessageUserId: action.userId,
        sendMessageUserName: action.userName
      };
    case IUseSendMessageActionTypes.ON_CLOSE_SEND_MESSAGE_MODAL:
      return {
        ...state,
        sendMessageUserId: null,
        sendMessageUserName: null,
        sendMessageTextInput: {...sendMessageText}
      };
    case IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_FOCUSED:
      return {
        ...state,
        sendMessageTextInput: {
          ...state.sendMessageTextInput,
          messageText: {
            ...state.sendMessageTextInput.messageText,
            focused: true,
            touched: true
          }
        }
      };
    case IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_UNFOCUSED:
      return {
        ...state,
        sendMessageTextInput: {
          ...state.sendMessageTextInput,
          messageText: {
            ...state.sendMessageTextInput.messageText,
            focused: false
          }
        }
      };
    case IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_CHANGED:
      return {
        ...state,
        sendMessageTextInput: {
          ...state.sendMessageTextInput,
          messageText: {
            ...state.sendMessageTextInput.messageText,
            value: action.inputValue
          }
        }
      };
    case IUseSendMessageActionTypes.ON_SEND_MESSAGE_UPLOAD_PHOTO:
      return {
        ...state,
        sendMessagePhoto: action.photoFile,
        sendMessagePhotoPreview: URL.createObjectURL(action.photoFile)
      };
    case IUseSendMessageActionTypes.ON_DELETE_SEND_MESSAGE_PHOTO:
      return {
        ...state,
        sendMessagePhoto: null,
        sendMessagePhotoPreview: null
      };
    case IUseSendMessageActionTypes.ON_SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sendMessageLoading: false,
        sendMessageUserId: null,
        sendMessageUserName: null,
        sendMessageTextInput: {...sendMessageText},
        sendMessagePhoto: null,
        sendMessagePhotoPreview: null
      };
    default:
      return state;
  }
};

export default reducer;