import { IInput, IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const sendMessageText: {[group: string]: IInput} = {
  messageText: {
    elementType: IInputElementTypes.INPUT_TEXTAREA,
    inputDisplay: IInputDisplays.INPUT_BLOCK,
    attributes: {
      id: "text",
      name: "text",
      placeholder: "Write something"
    },
    label: {
      labelFor: "text",
      labelText: "Write something",
      labelShow: false
    },
    validation: {
      required: false
    },
    focused: false,
    touched: false,
    value: "",
    valid: true
  }
};