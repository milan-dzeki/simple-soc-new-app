import { IInput } from "./inputType";

export interface IForm {
  inputs: {
    [group: string]: {
      [input: string]: IInput;
    };
  };
  passwordsKeynames?: string[];
  formIsValid: boolean;
}