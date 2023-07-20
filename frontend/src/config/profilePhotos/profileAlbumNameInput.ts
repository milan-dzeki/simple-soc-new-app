import { IInput, IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const nameInput: {[group: string]: IInput} = {
  albumName: {
    elementType: IInputElementTypes.INPUT_TEXT,
    inputDisplay: IInputDisplays.INPUT_BLOCK,
    attributes: {
      type: "text",
      name: "name",
      id: "name",
      placeholder: "Album Name"
    },
    label: {
      labelFor: "name",
      labelShow: false,
      labelText: "Album Name"
    },
    validation: {
      required: true
    },
    focused: false,
    touched: false,
    value: "",
    valid: false,
    errorMsg: "Album name is required"
  }
};