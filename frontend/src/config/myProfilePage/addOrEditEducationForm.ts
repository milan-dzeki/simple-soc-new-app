import { IForm } from "../../types/formsAndInputs/form";
import { IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const addOrEditEducationForm: IForm = {
  inputs: {
    info: {
      name: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_BLOCK,
        attributes: {
          type: "text",
          name: "name",
          id: "name",
          placeholder: "Education Name"
        },
        label: {
          labelFor: "name",
          labelText: "Education Name"
        },
        validation: {
          required: true
        },
        focused: false,
        touched: false,
        value: "",
        valid: false,
        errorMsg: "Education Name is required"
      },
      country: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "country",
          id: "country",
          placeholder: "Education Country"
        },
        label: {
          labelShow: false,
          labelFor: "country",
          labelText: "Education Country"
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
          placeholder: "Education State"
        },
        label: {
          labelShow: false,
          labelFor: "state",
          labelText: "Education State"
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
          placeholder: "Education City"
        },
        label: {
          labelShow: false,
          labelFor: "city",
          labelText: "Education City"
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
      status: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "status",
          id: "status",
          placeholder: "Status"
        },
        label: {
          labelShow: false,
          labelFor: "status",
          labelText: "Status"
        },
        validation: {
          required: true
        },
        focused: false,
        touched: false,
        value: "",
        valid: true,
        options: [
          "studying", "finished"
        ],
        optionsShow: false,
        errorMsg: "Status is required"
      },
      graduateDate: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "date",
          name: "graduateDate",
          id: "graduateDate",
          placeholder: "Graduate Date"
        },
        label: {
          labelShow: true,
          labelFor: "graduateDate",
          labelText: "Graduate Date"
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