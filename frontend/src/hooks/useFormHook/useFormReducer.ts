import { IForm } from "../../types/formsAndInputs/form";
import { IInputElementTypes } from "../../types/formsAndInputs/inputType";
import { Action, ActionTypes } from "./useFormTypes";
import { isInputValid } from "../../utils/isInputValid";
import { thirtyDaysMonths } from "../../config/datesStuff/months";
import { getMonthDaysForInputOptions } from "../../utils/getMontHDaysForInputOptions";

const reducer = (state: IForm, action: Action): IForm => {
  switch(action.type) {
    case ActionTypes.ON_SET_FORM:
      return action.providedForm;
    case ActionTypes.ON_INPUT_FOCUS:
      if(state.inputs[action.inputGroup][action.inputName].elementType === IInputElementTypes.INPUT_SELECT) {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputGroup]: {
              ...state.inputs[action.inputGroup],
              [action.inputName]: {
                ...state.inputs[action.inputGroup][action.inputName],
                focused: true,
                touched: true,
                optionsShow: true
              }
            }
          }
        };
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputGroup]: {
            ...state.inputs[action.inputGroup],
            [action.inputName]: {
              ...state.inputs[action.inputGroup][action.inputName],
              focused: true,
              touched: true
            }
          }
        }
      };
    case ActionTypes.ON_COUNTRY_INPUT_FOCUS:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputGroup]: {
            ...state.inputs[action.inputGroup],
            [action.inputName]: {
              ...state.inputs[action.inputGroup][action.inputName],
              focused: true,
              touched: true,
              optionsShow: true,
              options: action.countries
            }
          }
        }
      };
    case ActionTypes.ON_INPUT_UNFOCUS:
      if(state.inputs[action.inputGroup][action.inputName].elementType === IInputElementTypes.INPUT_SELECT) {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputGroup]: {
              ...state.inputs[action.inputGroup],
              [action.inputName]: {
                ...state.inputs[action.inputGroup][action.inputName],
                focused: false,
                optionsShow: false
              }
            }
          }
        };
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputGroup]: {
            ...state.inputs[action.inputGroup],
            [action.inputName]: {
              ...state.inputs[action.inputGroup][action.inputName],
              focused: false
            }
          }
        }
      };
    case ActionTypes.ON_INPUT_CHANGE:
      if(action.inputName.toLowerCase().includes("password") && !action.inputName.toLowerCase().includes("confirm") && state.passwordsKeynames && state.passwordsKeynames.length > 1 && state.passwordsKeynames.find(key => key.toLowerCase().includes("confirm"))) {
        let confirmationKeyName: string = state.passwordsKeynames.find(key => key.toLowerCase().includes("confirm"))!;
        
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputGroup]: {
              ...state.inputs[action.inputGroup],
              [action.inputName]: {
                ...state.inputs[action.inputGroup][action.inputName],
                value: action.inputValue,
                valid: isInputValid(action.inputValue, state.inputs[action.inputGroup][action.inputName].validation)
              },
              [confirmationKeyName]: {
                ...state.inputs[action.inputGroup][confirmationKeyName],
                valid: state.inputs[action.inputGroup][confirmationKeyName].value === action.inputValue && isInputValid(action.inputValue, state.inputs[action.inputGroup][action.inputName].validation),
                disabled: !isInputValid(action.inputValue, state.inputs[action.inputGroup][action.inputName].validation)
              }
            }
          }
        };
      }
      if(action.inputName.toLowerCase().includes("confirm") && action.inputName.toLowerCase().includes("password") && state.passwordsKeynames && state.passwordsKeynames.find(key => key.toLowerCase().includes("confirm"))) {
        let passwordKeyName: string = state.passwordsKeynames.find(key => !key.toLowerCase().includes("confirm"))!;

        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputGroup]: {
              ...state.inputs[action.inputGroup],
              [action.inputName]: {
                ...state.inputs[action.inputGroup][action.inputName],
                value: action.inputValue,
                valid: isInputValid(action.inputValue, state.inputs[action.inputGroup][action.inputName].validation) && state.inputs[action.inputGroup][passwordKeyName].value === action.inputValue
              }
            }
          }
        };
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputGroup]: {
            ...state.inputs[action.inputGroup],
            [action.inputName]: {
              ...state.inputs[action.inputGroup][action.inputName],
              value: action.inputValue,
              valid: isInputValid(action.inputValue, state.inputs[action.inputGroup][action.inputName].validation)
            }
          }
        }
      };
    case ActionTypes.ON_SELECT_INPUT_CHANGE:
      if(action.inputName === "birthMonth" && "birthDay" in state.inputs[action.inputGroup]) {
        let days = getMonthDaysForInputOptions(31);
        let dayNum = 31;
        if(thirtyDaysMonths.includes(action.inputValue)) {
          dayNum = 30;
        } else if(action.inputValue === "February") {
          dayNum = 28;
        }

        days = getMonthDaysForInputOptions(dayNum);

        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputGroup]: {
              ...state.inputs[action.inputGroup],
              [action.inputName]: {
                ...state.inputs[action.inputGroup][action.inputName],
                focused: false,
                optionsShow: false,
                value: action.inputValue
              },
              birthDay: {
                ...state.inputs[action.inputGroup].birthDay,
                value: "",
                options: days
              }
            }
          }
        };
      }
      if(action.inputName.toLowerCase().includes("country")) {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputGroup]: {
              ...state.inputs[action.inputGroup],
              country: {
                ...state.inputs[action.inputGroup].country,
                focused: false,
                optionsShow: false,
                value: action.inputValue
              },
              state: {
                ...state.inputs[action.inputGroup].state,
                options: action.states,
                disabled: action.statesDisabled,
                value: ""
              },
              city: {
                ...state.inputs[action.inputGroup].city,
                options: action.cities,
                disabled: action.citiesDisabled,
                value: ""
              }
            }
          }
        };
      }
      if(action.inputName.toLowerCase().includes("state")) {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputGroup]: {
              ...state.inputs[action.inputGroup],
              state: {
                ...state.inputs[action.inputGroup].state,
                focused: false,
                optionsShow: false,
                value: action.inputValue
              },
              city: {
                ...state.inputs[action.inputGroup].city,
                options: action.cities,
                disabled: action.citiesDisabled,
                value: ""
              }
            }
          }
        };
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputGroup]: {
            ...state.inputs[action.inputGroup],
            [action.inputName]: {
              ...state.inputs[action.inputGroup][action.inputName],
              focused: false,
              optionsShow: false,
              value: action.inputValue,
              valid: isInputValid(action.inputValue, state.inputs[action.inputGroup][action.inputName].validation)
            }
          }
        }
      };
    case ActionTypes.ON_RADIO_INPUT_CHANGE:
      let copiedInputs = {...state.inputs};
      for(const group in copiedInputs) {
        for(const input in copiedInputs[group]) {
          copiedInputs[group] = {
            ...copiedInputs[group],
            [input]: {
              ...copiedInputs[group][input],
              attributes: {
                ...copiedInputs[group][input].attributes
              }
            }
          };
          if(group === action.inputGroup && input !== action.inputName && copiedInputs[group][input].attributes.name === action.inputGroupName) {
            copiedInputs[group][input].attributes.checked = false;
          }
        }
      }

      copiedInputs[action.inputGroup][action.inputName].attributes.checked = true;

      return {
        ...state,
        inputs: copiedInputs
      };
    case ActionTypes.ON_TOGGLE_PASSWORD_INPUT_VISIBILITY:
      let newType: "text" | "password" = "password";
      if(state.inputs[action.inputGroup][action.inputName].attributes.type === "password") {
        newType = "text"
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputGroup]: {
            ...state.inputs[action.inputGroup],
            [action.inputName]: {
              ...state.inputs[action.inputGroup][action.inputName],
              attributes: {
                ...state.inputs[action.inputGroup][action.inputName].attributes,
                type: newType
              },
              focused: true
            }
          }
        }
      };
    case ActionTypes.IS_FORM_VALID:
      return {
        ...state,
        formIsValid: action.formIsValid
      };
    default:
      return state;
  }
};

export default reducer;