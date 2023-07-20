import { FC, ChangeEvent, memo } from 'react';
import styles from '../../styles/components/inputs/inputRenderer.module.scss';
// types
import { IForm } from '../../types/formsAndInputs/form';
// components
import Input from './Input';
// utils
import { removeUnderscoresBetweenWords } from '../../utils/removeUnderscoresBetweenWords';
import { IInputElementTypes } from '../../types/formsAndInputs/inputType';

interface Props {
  groupTitleShow: boolean;
  groupsPosition: "flex" | "block";
  inputs: IForm["inputs"];
  hasBorderBottom: boolean;
  onInputFocus: (inputGroup: string, inputName: string) => void;
  onCountryInputFocus?: (inputGroup: string, inputName: string) => void;
  onInputUnfocus: (inputGroup: string, inputName: string) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onSelectInputChange: (inputGroup: string, inputName: string, inputValue: string) => Promise<void>;
  onRadioInputChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onTogglePasswordInputVisibility?: (inputGroup: string, inputName: string) => void;
}

const InputRenderer: FC<Props> = (props) => {
  return (
    <div className={`${styles.inputs} ${props.groupsPosition === "flex" ? styles.inputs__flex : ""}`}>
      {
        Object.keys(props.inputs).map(group => {
          return (
            <div key={group} className={styles.inputs__group}>
              {props.groupTitleShow && (
                <h3 className={styles.inputs__group_title}>
                  {removeUnderscoresBetweenWords(group)}
                </h3>
              )}
              {
                Object.keys(props.inputs[group]).map(input => {
                  const el = props.inputs[group][input];
                  
                  return (
                    <Input
                      key={input}
                      inputGroup={group}
                      elementType={el.elementType}
                      inputDisplay={el.inputDisplay}
                      attributes={el.attributes}
                      label={el.label}
                      validation={el.validation}
                      focused={el.focused}
                      touched={el.touched}
                      value={el.value}
                      valid={el.valid}
                      errorMsg={el.errorMsg}
                      files={el.files}
                      disabled={el.disabled || false}
                      options={el.options}
                      optionsShow={el.optionsShow}
                      onInputFocus={
                        input.toLowerCase().includes("country")
                        ? props.onCountryInputFocus!
                        : props.onInputFocus
                      }
                      onInputUnfocus={props.onInputUnfocus}
                      onInputChange={
                        el.elementType === IInputElementTypes.INPUT_TEXT
                        ? props.onInputChange
                        : props.onRadioInputChange!
                      }
                      onSelectInputChange={props.onSelectInputChange}
                      onTogglePasswordInputVisibility={props.onTogglePasswordInputVisibility} />
                  );
                })
              }
            </div>
          );
        })
      }
    </div>
  );
};

export default memo(InputRenderer);