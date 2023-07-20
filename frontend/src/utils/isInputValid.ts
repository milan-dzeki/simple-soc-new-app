import { IInputValidation } from "../types/formsAndInputs/inputType";

export const isInputValid = (inputValue: string, validation: IInputValidation): boolean => {
  let isValid = true;

  if(!validation.required) {
    isValid = true;
  }
  if(validation.required) {
    isValid = isValid && inputValue.trim().length > 0;
  }
  if(validation.required && validation.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = isValid && inputValue.trim().length > 0 && pattern.test(inputValue);
  }
  if(validation.required && validation.minlength) {
    isValid = isValid && inputValue.length >= validation.minlength;
  }

  return isValid;
};