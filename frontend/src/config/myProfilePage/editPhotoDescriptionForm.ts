import { IInput, IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const editPhotoDescriptionInput: {[group: string]: IInput} = {
  description: {
    elementType: IInputElementTypes.INPUT_TEXT,
    inputDisplay: IInputDisplays.INPUT_BLOCK,
    attributes: {
      id: "description",
      name: "description",
      placeholder: "Describe photo"
    },
    label: {
      labelShow: true,
      labelFor: "description",
      labelText: "Description"
    },
    validation: {
      required: true
    },
    focused: false,
    touched: false,
    value: "",
    valid: false,
    errorMsg: "Some text is required before submiting"
  }
};