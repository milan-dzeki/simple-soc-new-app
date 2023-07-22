import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useCallback, useReducer } from "react";
import { sendMessageText } from "../../config/messaging/sendMessageText";
import reducer from "./useSendMessageReducer";
import { IUseSendMessageActionTypes, IUseSendMessageState } from "./useSendMessageTypes";
import axiosChat from "../../axios/axiosChat";
import { IInput } from "../../types/formsAndInputs/inputType";
import socket from "../../socketIo";

const initState: IUseSendMessageState = {
  sendMessageLoading: false,
  sendMessageErrorMsg: null,
  sendMessageTextInput: {...sendMessageText},
  sendMessagePhoto: null,
  sendMessagePhotoPreview: null,
  sendMessageUserId: null,
  sendMessageUserName: null
};

export const useSendMessage = (): {
  sendMessageLoading: boolean;
  sendMessageErrorMsg: string | null;
  messageInfo: {
    userId: string | null;
    userName: string | null;
    messageTextInput: {[group: string]: IInput};
    messagePhoto: File | null;
    messagePhotoPreview: string | null;
  };
  onClearSendMessageError: () => void;
  onOpenSendMessageModal: (userId: string, userName: string) => void;
  onCloseSendMessageModal: () => void;
  onSendMessageInputTextFocused: () => void;
  onSendMessageInputTextUnfocused: () => void;
  onSendMessageInputTextChanged: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onSendMessageUploadPhoto: ChangeEventHandler<HTMLInputElement>;
  onDeleteSendMessagePhoto: () => void;
  onSendMessage: FormEventHandler<HTMLFormElement>;
} => {
  const [state, dispatch] = useReducer(reducer, initState);

  const onClearSendMessageError = useCallback((): void => {
    dispatch({ type: IUseSendMessageActionTypes.ON_CLEAR_SEND_MESSAGE_ERROR });
  }, []);

  const onOpenSendMessageModal = useCallback((userId: string, userName: string): void => {
    dispatch({
      type: IUseSendMessageActionTypes.ON_OPEN_SEND_MESSAGE_MODAL,
      userId,
      userName
    });
  }, []);

  const onCloseSendMessageModal = useCallback((): void => {
    dispatch({ type: IUseSendMessageActionTypes.ON_CLOSE_SEND_MESSAGE_MODAL });
  }, []);

  const onSendMessageInputTextFocused = useCallback((): void => {
    dispatch({ type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_FOCUSED });
  }, []);

  const onSendMessageInputTextUnfocused = useCallback((): void => {
    dispatch({ type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_UNFOCUSED });
  }, []);

  const onSendMessageInputTextChanged = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, _: string): void => {
    const target = event.target;

    dispatch({
      type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_CHANGED,
      inputValue: target.value
    });
  }, []);

  const onSendMessageUploadPhoto = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;

    if(target.files && target.files.length > 0) {
      dispatch({
        type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_UPLOAD_PHOTO,
        photoFile: target.files[0]
      });
    } else {
      dispatch({ type: IUseSendMessageActionTypes.ON_DELETE_SEND_MESSAGE_PHOTO });
    }
  }, []);

  const onDeleteSendMessagePhoto = useCallback((): void => {
    dispatch({ type: IUseSendMessageActionTypes.ON_DELETE_SEND_MESSAGE_PHOTO });
  }, []);

  const onSendMessage = useCallback(async(event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    dispatch({ type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_START });

    const formData = new FormData();
    if(!state.sendMessageUserId) return;
    formData.append("userId", state.sendMessageUserId);
    formData.append("messageText", state.sendMessageTextInput.messageText.value);
    if(state.sendMessagePhoto) {
      formData.append("messagePhoto", state.sendMessagePhoto);
    }

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosChat.post("/sendModalMessage", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch({ type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_SUCCESS });
      // socket.emit("sendModalMessage", {userId: });
      socket.emit("sendMessage", {userId: state.sendMessageUserId, chatId: data.chatId, newLastMessage: data.newLastMessage, message: data.newMessage});
    } catch(error) {
      dispatch({
        type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_FAIL,
        errorMsg: (error as any).response.data.message
      });
    }
  }, [state.sendMessagePhoto, state.sendMessageTextInput.messageText.value, state.sendMessageUserId]);

  return {
    sendMessageLoading: state.sendMessageLoading,
    sendMessageErrorMsg: state.sendMessageErrorMsg,
    messageInfo: {
      userId: state.sendMessageUserId,
      userName: state.sendMessageUserName,
      messageTextInput: state.sendMessageTextInput,
      messagePhoto: state.sendMessagePhoto,
      messagePhotoPreview: state.sendMessagePhotoPreview
    },
    onClearSendMessageError,
    onOpenSendMessageModal,
    onCloseSendMessageModal,
    onSendMessageInputTextFocused,
    onSendMessageInputTextUnfocused,
    onSendMessageInputTextChanged,
    onSendMessageUploadPhoto,
    onDeleteSendMessagePhoto,
    onSendMessage
  };
};