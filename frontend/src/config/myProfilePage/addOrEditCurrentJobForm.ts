import { IForm } from "../../types/formsAndInputs/form";
import { IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const addOrEditCurrentJobForm: IForm = {
  inputs: {
    info: {
      role: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "role",
          id: "role",
          placeholder: "Work Role"
        },
        label: {
          labelFor: "role",
          labelText: "Work Role"
        },
        validation: {
          required: true
        },
        focused: false,
        touched: false,
        value: "",
        valid: false,
        errorMsg: "Role is required"
      },
      company: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "company",
          id: "company",
          placeholder: "Company"
        },
        label: {
          labelFor: "company",
          labelText: "Company"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true
      },
      country: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "country",
          id: "country",
          placeholder: "Job Country"
        },
        label: {
          labelShow: false,
          labelFor: "country",
          labelText: "Job Country"
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
          placeholder: "Job State"
        },
        label: {
          labelShow: false,
          labelFor: "state",
          labelText: "Job State"
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
          placeholder: "Job City"
        },
        label: {
          labelShow: false,
          labelFor: "city",
          labelText: "Job City"
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
          placeholder: "You work here since"
        },
        label: {
          labelShow: true,
          labelFor: "from",
          labelText: "You work here since"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true
      }
    }
  },
  formIsValid: false
};