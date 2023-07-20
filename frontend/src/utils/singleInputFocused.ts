import { IInput } from "../types/formsAndInputs/inputType";

export const onSingleInputFocused = (setInput: React.Dispatch<React.SetStateAction<{
    [group: string]: IInput;
}>>, inputGroup: string): void => {
  setInput(prev => {
    return {
      ...prev,
      [inputGroup]: {
        ...prev[inputGroup],
        focused: true,
        touched: true
      }
    };
  });
};