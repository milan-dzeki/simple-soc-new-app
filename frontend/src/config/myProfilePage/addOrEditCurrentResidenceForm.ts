import { IForm } from "../../types/formsAndInputs/form";
import { IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const addOrEditCurrentResidenceForm: IForm = {
  inputs: {
    info: {
      country: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "country",
          id: "country",
          placeholder: "Country"
        },
        label: {
          labelShow: false,
          labelFor: "country",
          labelText: "Country"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true,
        options: [],
        optionsShow: false
      },
      state: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "state",
          id: "state",
          placeholder: "State"
        },
        label: {
          labelShow: false,
          labelFor: "state",
          labelText: "State"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true,
        options: [],
        optionsShow: false,
        disabled: true
      },
      city: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "city",
          id: "city",
          placeholder: "City"
        },
        label: {
          labelShow: false,
          labelFor: "city",
          labelText: "City"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true,
        options: [],
        optionsShow: false,
        disabled: true
      },
      from: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "date",
          name: "from",
          id: "from",
          placeholder: "You lived here since"
        },
        label: {
          labelShow: true,
          labelFor: "from",
          labelText: "You lived here since"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true
      },
    }
  },
  formIsValid: false
};