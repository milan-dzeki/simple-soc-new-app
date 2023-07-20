export enum IInputElementTypes {
  INPUT_TEXT = "INPUT_TEXT",
  INPUT_TEXTAREA = "INPUT_TEXTAREA",
  INPUT_SELECT = "INPUT_SELECT",
  INPUT_DATALIST = "INPUT_DATALIST",
  INPUT_RADIO = "INPUT_RADIO",
  INPUT_FILE_SINGLE = "INPUT_FILE_SINGLE"
}

type IInputElementType = (
  IInputElementTypes.INPUT_DATALIST |
  IInputElementTypes.INPUT_RADIO |
  IInputElementTypes.INPUT_TEXT |
  IInputElementTypes.INPUT_TEXTAREA |
  IInputElementTypes.INPUT_SELECT |
  IInputElementTypes.INPUT_FILE_SINGLE
);

export enum IInputDisplays {
  INPUT_BLOCK = "input_block",
  INPUT_INLINE_BLOCK_HALF = "input_inline_block_half",
  INPUT_INLINE_BLOCK_THIRD = "input_inline_block_third",
  INPUT_INLINE_BLOCK_QUARTER = "input_inline_block_quarter"
}

type IInputDisplay = (
  IInputDisplays.INPUT_BLOCK |
  IInputDisplays.INPUT_INLINE_BLOCK_HALF |
  IInputDisplays.INPUT_INLINE_BLOCK_THIRD |
  IInputDisplays.INPUT_INLINE_BLOCK_QUARTER
);

export interface IInputValidation {
  required: boolean;
  isEmail?: boolean;
  minlength?: number;
}

export interface IInput {
  elementType: IInputElementType;
  inputDisplay: IInputDisplay;
  attributes: {
    type?: "text" | "email" | "password" | "radio" | "file" | "date";
    id: string;
    name: string;
    placeholder?: string;
    checked?: boolean;
    accept?: string;
  };
  label: {
    labelFor: string;
    labelText: string;
    labelShow?: boolean;
    groupLabel?: string;
    isGroupLabel?: boolean;
  };
  validation: IInputValidation;
  focused: boolean;
  touched: boolean;
  value: string;
  valid: boolean;
  files?: File | FileList | null;
  disabled?: boolean;
  options?: string[];
  optionsShow?: boolean;
  errorMsg?: string;
}