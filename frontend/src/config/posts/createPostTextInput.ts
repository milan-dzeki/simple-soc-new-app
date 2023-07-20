import { IInput, IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const createPostTextInput: {[group: string]: IInput} = {
  postText: {
    elementType: IInputElementTypes.INPUT_TEXTAREA,
    inputDisplay: IInputDisplays.INPUT_BLOCK,
    attributes: {
      type: "text",
      name: "text",
      id: "text",
      placeholder: "Write something"
    },
    label: {
      labelFor: "text",
      labelShow: false,
      labelText: "Post Text"
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