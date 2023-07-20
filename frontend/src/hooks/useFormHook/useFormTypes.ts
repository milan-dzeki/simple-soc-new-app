import { IForm } from "../../types/formsAndInputs/form";


export enum ActionTypes {
  ON_SET_FORM = "ON_SET_FORM",
  ON_INPUT_FOCUS = "ON_INPUT_FOCUS",
  ON_COUNTRY_INPUT_FOCUS = "ON_COUNTRY_INPUT_FOCUS",
  ON_INPUT_UNFOCUS = "ON_INPUT_UNFOCUS",
  ON_INPUT_CHANGE = "ON_INPUT_CHANGE",
  ON_SELECT_INPUT_CHANGE = "ON_SELECT_INPUT_CHANGE",
  ON_RADIO_INPUT_CHANGE = "ON_RADIO_INPUT_CHANGE",
  ON_TOGGLE_PASSWORD_INPUT_VISIBILITY = "ON_TOGGLE_PASSWORD_INPUT_VISIBILITY",
  IS_FORM_VALID = "IS_FORM_VALID"
}

interface OnSetFormAction {
  type: ActionTypes.ON_SET_FORM;
  providedForm: IForm;
}
interface OnInputFocusAction {
  type: ActionTypes.ON_INPUT_FOCUS;
  inputGroup: string;
  inputName: string;
}
interface OnCountryInputFocusAction {
  type: ActionTypes.ON_COUNTRY_INPUT_FOCUS;
  inputGroup: string;
  inputName: string;
  countries: string[];
}
interface OnInputUnfocusAction {
  type: ActionTypes.ON_INPUT_UNFOCUS;
  inputGroup: string;
  inputName: string;
}
interface OnInputChangeAction {
  type: ActionTypes.ON_INPUT_CHANGE;
  inputGroup: string;
  inputName: string;
  inputValue: string;
}
interface OnSelectInputChangeAction {
  type: ActionTypes.ON_SELECT_INPUT_CHANGE;
  inputGroup: string;
  inputName: string;
  inputValue: string;
  states?: string[];
  cities?: string[];
  statesDisabled?: boolean;
  citiesDisabled?: boolean;
}
interface OnRadioInputChangeAction {
  type: ActionTypes.ON_RADIO_INPUT_CHANGE;
  inputGroup: string;
  inputGroupName: string;
  inputName: string;
}
interface OnTogglePasswordInputVisibilityAction {
  type: ActionTypes.ON_TOGGLE_PASSWORD_INPUT_VISIBILITY;
  inputGroup: string;
  inputName: string;
}
interface IsFormValidAction {
  type: ActionTypes.IS_FORM_VALID;
  formIsValid: boolean;
}

export type Action = (
  OnSetFormAction |
  OnInputFocusAction |
  OnCountryInputFocusAction |
  OnInputUnfocusAction |
  OnSelectInputChangeAction |
  OnInputChangeAction |
  OnRadioInputChangeAction |
  OnTogglePasswordInputVisibilityAction |
  IsFormValidAction
);