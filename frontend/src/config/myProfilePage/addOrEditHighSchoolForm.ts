import { IForm } from "../../types/formsAndInputs/form";
import { IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const addOrEditHighSchoolForm: IForm = {
  inputs: {
    info: {
      name: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_BLOCK,
        attributes: {
          type: "text",
          name: "name",
          id: "name",
          placeholder: "School Name"
        },
        label: {
          labelFor: "name",
          labelText: "School Name"
        },
        validation: {
          required: true
        },
        focused: false,
        touched: false,
        value: "",
        valid: false,
        errorMsg: "School Name is required"
      },
      country: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "country",
          id: "country",
          placeholder: "School Country"
        },
        label: {
          labelShow: false,
          labelFor: "country",
          labelText: "School Country"
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
          placeholder: "School State"
        },
        label: {
          labelShow: false,
          labelFor: "state",
          labelText: "School State"
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
          placeholder: "School City"
        },
        label: {
          labelShow: false,
          labelFor: "city",
          labelText: "School City"
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
        valid: false,
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