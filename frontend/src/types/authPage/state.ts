export enum IFormTitles {
  SIGNUP = "signup",
  LOGIN = "login"
}

export type IFormTitle = IFormTitles.SIGNUP | IFormTitles.LOGIN;

export enum IFormSwitchTexts {
  HAVE_ACCOUNT = "Already have account?",
  NO_ACCOUNT = "Don't have account?"
}

export type IFormSwitchText = IFormSwitchTexts.HAVE_ACCOUNT | IFormSwitchTexts.NO_ACCOUNT;

export enum IFormSwitchBtnTexts {
  SWITCH_TO_LOGIN = "switch to login",
  SWITCH_TO_SIGNUP = "register instead"
}

export type IFormSwitchBtnText = IFormSwitchBtnTexts.SWITCH_TO_LOGIN | IFormSwitchBtnTexts.SWITCH_TO_SIGNUP;

export interface IAuthPageState {
  formTitle: IFormTitle;
  formSubmitBtnText: IFormTitle;
  formSwitchText: IFormSwitchText;
  formSwitchBtnText: IFormSwitchBtnText;
}

