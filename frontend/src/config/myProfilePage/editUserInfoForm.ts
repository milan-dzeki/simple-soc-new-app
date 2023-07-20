import { IForm } from "../../types/formsAndInputs/form";
import { IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";
import { getYearsForInputOptions } from "../../utils/getYearsForInputOptions";
import { getMonthDaysForInputOptions } from "../../utils/getMontHDaysForInputOptions";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const editUserInfoForm: IForm = {
  inputs: {
    info: {
      firstName: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "firstName",
          id: "firstName",
          placeholder: "First Name"
        },
        label: {
          labelFor: "firstName",
          labelText: "First Name"
        },
        validation: {
          required: true
        },
        focused: false,
        touched: false,
        value: "",
        valid: false,
        errorMsg: "First Name is required"
      },
      lastName: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_HALF,
        attributes: {
          type: "text",
          name: "lastName",
          id: "lastName",
          placeholder: "Last Name"
        },
        label: {
          labelFor: "lastName",
          labelText: "Last Name"
        },
        validation: {
          required: true
        },
        focused: false,
        touched: false,
        value: "",
        valid: false,
        errorMsg: "Last Name is required"
      },
      birthYear: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_THIRD,
        attributes: {
          type: "text",
          name: "birthYear",
          id: "birthYear",
          placeholder: "Birth Year"
        },
        label: {
          labelShow: true,
          labelFor: "birthYear",
          labelText: "Birth Year",
          groupLabel: "Date of Birth",
          isGroupLabel: true
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true,
        options: getYearsForInputOptions(),
        optionsShow: false
      },
      birthMonth: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_THIRD,
        attributes: {
          type: "text",
          name: "birthMonth",
          id: "birthMonth",
          placeholder: "Birth Month"
        },
        label: {
          labelShow: true,
          labelFor: "birthMonth",
          labelText: "Birth Month",
          isGroupLabel: true
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true,
        options: months,
        optionsShow: false
      },
      birthDay: {
        elementType: IInputElementTypes.INPUT_SELECT,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_THIRD,
        attributes: {
          type: "text",
          name: "birthDay",
          id: "birthDay",
          placeholder: "Birth Day"
        },
        label: {
          labelShow: true,
          labelFor: "birthDay",
          labelText: "Birth Day",
          isGroupLabel: true
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "",
        valid: true,
        options: getMonthDaysForInputOptions(30),
        optionsShow: false
      },
      genderMale: {
        elementType: IInputElementTypes.INPUT_RADIO,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_QUARTER,
        attributes: {
          type: "radio",
          name: "gender",
          id: "genderMale",
          checked: false
        },
        label: {
          labelShow: true,
          labelFor: "genderMale",
          labelText: "male",
          groupLabel: "Gender"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "male",
        valid: true
      },
      genderFemale: {
        elementType: IInputElementTypes.INPUT_RADIO,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_QUARTER,
        attributes: {
          type: "radio",
          name: "gender",
          id: "genderFemale",
          checked: false
        },
        label: {
          labelShow: true,
          labelFor: "genderFemale",
          labelText: "female"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "female",
        valid: true
      },
      genderUnset: {
        elementType: IInputElementTypes.INPUT_RADIO,
        inputDisplay: IInputDisplays.INPUT_INLINE_BLOCK_QUARTER,
        attributes: {
          type: "radio",
          name: "gender",
          id: "genderUnset",
          checked: true
        },
        label: {
          labelShow: true,
          labelFor: "genderUnset",
          labelText: "unset"
        },
        validation: {
          required: false
        },
        focused: false,
        touched: false,
        value: "unset",
        valid: true
      },
      email: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_BLOCK,
        attributes: {
          type: "email",
          name: "email",
          id: "email",
          placeholder: "Email"
        },
        label: {
          labelFor: "email",
          labelText: "Email"
        },
        validation: {
          required: true,
          isEmail: true
        },
        focused: false,
        touched: false,
        value: "",
        valid: false,
        errorMsg: "Email with valid format is required"
      }
    }
  },
  formIsValid: false
};