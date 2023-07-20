import { IInput } from "../../types/formsAndInputs/inputType";

// STATE STUFF
export interface IUseSendMessageState {
  sendMessageLoading: boolean;
  sendMessageErrorMsg: string | null;
  sendMessageUserId: string | null;
  sendMessageUserName: string | null;
  sendMessageTextInput: {[group: string]: IInput};
  sendMessagePhoto: File | null;
  sendMessagePhotoPreview: string | null;
}

// ACTION STUFF
export enum IUseSendMessageActionTypes {
  ON_SEND_MESSAGE_START = "ON_SEND_MESSAGE_START",
  ON_SEND_MESSAGE_FAIL = "ON_SEND_MESSAGE_FAIL",
  ON_CLEAR_SEND_MESSAGE_ERROR = "ON_CLEAR_SEND_MESSAGE_ERROR",
  ON_OPEN_SEND_MESSAGE_MODAL = "ON_OPEN_SEND_MESSAGE_MODAL",
  ON_CLOSE_SEND_MESSAGE_MODAL = "ON_CLOSE_SEND_MESSAGE_MODAL",
  ON_SEND_MESSAGE_TEXT_INPUT_FOCUSED = "ON_SEND_MESSAGE_TEXT_INPUT_FOCUSED",
  ON_SEND_MESSAGE_TEXT_INPUT_UNFOCUSED = "ON_SEND_MESSAGE_TEXT_INPUT_UNFOCUSED",
  ON_SEND_MESSAGE_TEXT_INPUT_CHANGED = "ON_SEND_MESSAGE_TEXT_INPUT_CHANGED",
  ON_SEND_MESSAGE_UPLOAD_PHOTO = "ON_SEND_MESSAGE_UPLOAD_PHOTO",
  ON_DELETE_SEND_MESSAGE_PHOTO = "ON_DELETE_SEND_MESSAGE_PHOTO",
  ON_SEND_MESSAGE_SUCCESS = "ON_SEND_MESSAGE_SUCCESS"
}

interface OnSendMessageStartAction {
  type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_START;
}
interface OnSendMessageFailAction {
  type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_FAIL;
  errorMsg: string;
}
interface OnClearSendMessageErrorAction {
  type: IUseSendMessageActionTypes.ON_CLEAR_SEND_MESSAGE_ERROR;
}
interface OnOpenSendMessageModalAction {
  type: IUseSendMessageActionTypes.ON_OPEN_SEND_MESSAGE_MODAL;
  userId: string;
  userName: string;
}
interface OnCloseSendMessageModalAction {
  type: IUseSendMessageActionTypes.ON_CLOSE_SEND_MESSAGE_MODAL;
}
interface OnSendMessageTextInputFocusedAction {
  type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_FOCUSED;
}
interface OnSendMessageTextInputUnfocusedAction {
  type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_UNFOCUSED;
}
interface OnSendMessageTextInputChangedAction {
  type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_TEXT_INPUT_CHANGED;
  inputValue: string;
}
interface OnSendMessageUploadPhotoAction {
  type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_UPLOAD_PHOTO;
  photoFile: File;
}
interface OnDeletePhotoSendMessageAction {
  type: IUseSendMessageActionTypes.ON_DELETE_SEND_MESSAGE_PHOTO;
}
interface OnSendMessageSuccessAction {
  type: IUseSendMessageActionTypes.ON_SEND_MESSAGE_SUCCESS;
}

export type IUseSendMessageAction = (
  OnSendMessageStartAction |
  OnSendMessageFailAction |
  OnClearSendMessageErrorAction |
  OnOpenSendMessageModalAction |
  OnCloseSendMessageModalAction |
  OnSendMessageTextInputFocusedAction |
  OnSendMessageTextInputUnfocusedAction |
  OnSendMessageTextInputChangedAction |
  OnSendMessageUploadPhotoAction |
  OnDeletePhotoSendMessageAction |
  OnSendMessageSuccessAction
);

// RESPONSE TYPES