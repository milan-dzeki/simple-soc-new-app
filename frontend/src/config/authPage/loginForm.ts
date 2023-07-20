import { IForm } from "../../types/formsAndInputs/form";
import { IInputDisplays, IInputElementTypes } from "../../types/formsAndInputs/inputType";

export const loginForm: IForm = {
  inputs: {
    authentication_credentials: {
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
      },
      password: {
        elementType: IInputElementTypes.INPUT_TEXT,
        inputDisplay: IInputDisplays.INPUT_BLOCK,
        attributes: {
          type: "password",
          name: "password",
          id: "password",
          placeholder: "Password"
        },
        label: {
          labelFor: "password",
          labelText: "Password"
        },
        validation: {
          required: true,
          minlength: 6
        },
        focused: false,
        touched: false,
        value: "",
        valid: false,
        errorMsg: "At least 6 characters are required"
      }
    }
  },
  formIsValid: false
};