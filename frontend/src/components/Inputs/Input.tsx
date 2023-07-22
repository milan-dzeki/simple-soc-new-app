import { FC, memo, ChangeEvent } from 'react';
import styles from '../../styles/components/inputs/input.module.scss';
// types
import { IInput, IInputElementTypes } from '../../types/formsAndInputs/inputType';
// components
import Backdrop from '../Shared/Backdrop';
import InputErrorPopup from './InputErrorPopup';

interface Props {
  inputGroup: string;
  onInputFocus: (inputGroup: string, inputName: string) => void;
  onInputUnfocus: (inputGroup: string, inputName: string) => void;
  onInputChange: ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void);
  onSelectInputChange?: (inputGroup: string, inputName: string, inputValue: string) => Promise<void>;
  onTogglePasswordInputVisibility?: (inputGroup: string, inputName: string) => void;
}

const Input: FC<IInput & Props> = (props) => {
  let inputElClassnames = [styles.input__el];
  
  if(props.focused) {
    inputElClassnames.push(styles.input__el_focused);
  }
  if(!props.focused && props.touched && props.valid) {
    inputElClassnames.push(styles.input__el_valid);
  }
  if(!props.focused && props.touched && !props.valid) {
    inputElClassnames.push(styles.input__el_invalid);
  }
  
  switch(props.elementType) {
    case IInputElementTypes.INPUT_TEXT:
      return (
        <div className={`${styles.input} ${styles[props.inputDisplay]}`}>
          <InputErrorPopup
            show={!props.focused && props.touched && !props.valid}
            text={props.errorMsg || "Field is required"} />
          <label 
            htmlFor={props.label.labelFor}
            className={`${styles.input__label} ${props.value.length > 0 || props.label.labelShow ? styles.input__label_show : ""}`}>
            {props.label.labelText}
          </label>
          <input
            className={inputElClassnames.join(" ")}
            type={props.attributes.type}
            name={props.attributes.name}
            id={props.attributes.id}
            placeholder={props.attributes.placeholder}
            value={props.value}
            disabled={props.disabled}
            onClick={() => props.onInputFocus(props.inputGroup, props.attributes.name)}
            onBlur={() => props.onInputUnfocus(props.inputGroup, props.attributes.name)}
            onChange={(event) => props.onInputChange(event, props.inputGroup)} />
          {
            props.attributes.name.toLowerCase().includes("password")
            ? props.attributes.type && props.attributes.type === "password"
            ? (
              <div className={styles.input__password} onClick={!props.disabled && props.onTogglePasswordInputVisibility ? () => props.onTogglePasswordInputVisibility!(props.inputGroup, props.attributes.name) : () => {return;}}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>
              </div>
            )
            : (
              <div className={styles.input__password} onClick={!props.disabled && props.onTogglePasswordInputVisibility ? () => props.onTogglePasswordInputVisibility!(props.inputGroup, props.attributes.name) : () => {return;}}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z"></path></svg>
              </div>
            )
            : null
          }
        </div>
      );
    case IInputElementTypes.INPUT_SELECT:
      return (
        <div className={`${styles.input__select} ${styles[props.inputDisplay]}`}>
          <InputErrorPopup
            show={!props.focused && props.touched && !props.valid}
            text={props.errorMsg || "Field is required"} />
          {
            props.label.groupLabel && (
              <p className={styles.input__group_label}>
                {props.label.groupLabel}
              </p>
            )
          }
          {!props.label.isGroupLabel && (
            <label 
              htmlFor={props.label.labelFor}
              className={`${styles.input__label} ${props.value.length > 0 || props.label.labelShow ? styles.input__label_show : ""}`}>
              {props.label.labelText}
            </label>
          )}
          <input
            className={inputElClassnames.join(" ")}
            type={props.attributes.type}
            name={props.attributes.name}
            id={props.attributes.id}
            placeholder={props.attributes.placeholder}
            value={props.value}
            readOnly={true}
            disabled={props.disabled}
            onClick={props.disabled ? () => {return;} : () => props.onInputFocus(props.inputGroup, props.attributes.name)} />
          <Backdrop
            show={props.optionsShow!}
            bcgColor="transparent"
            onClose={() => props.onInputUnfocus(props.inputGroup, props.attributes.name)} />
          <div className={`${styles.input__options} ${props.optionsShow ? styles.input__options_show : ""}`}>
            <div className={styles.input__options_content}>
              {props.options!.length === 0
              ? <p className={styles.input__opt_no_opt}>No options</p>
              :props.options!.map(opt => {
                return (
                  <p 
                    key={opt} 
                    className={styles.input__opt}
                    onClick={()=> props.onSelectInputChange!(props.inputGroup, props.attributes.name, opt)}>
                    {opt}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      );
    case IInputElementTypes.INPUT_DATALIST:
      return null;
    case IInputElementTypes.INPUT_RADIO:
      return (
        <div className={`${styles.input__radio} ${styles[props.inputDisplay]}`}>
          {
            props.label.groupLabel && (
              <p className={styles.input__group_label}>
                {props.label.groupLabel}
              </p>
            )
          }
          <input 
            className={styles.input__radio_el}
            type={props.attributes.type} 
            name={props.attributes.name} 
            id={props.attributes.id}
            value={props.value}
            checked={props.attributes.checked}
            onChange={(event) => props.onInputChange(event, props.inputGroup)} />
          <label htmlFor={props.label.labelFor} className={styles.input__radio_label}>
            {props.label.labelText}
          </label>
        </div>
      );
    case IInputElementTypes.INPUT_TEXTAREA:
      return (
        <div className={`${styles.input} ${styles[props.inputDisplay]}`}>
          <InputErrorPopup
            show={!props.focused && props.touched && !props.valid}
            text={props.errorMsg || "Field is required"} />
          <label 
            htmlFor={props.label.labelFor}
            className={`${styles.input__label} ${props.value.length > 0 ? styles.input__label_show : ""}`}>
            {props.label.labelText}
          </label>
          <textarea
            className={`${inputElClassnames.join(" ")} ${styles.input__el_textarea}`}
            name={props.attributes.name}
            id={props.attributes.id}
            placeholder={props.attributes.placeholder}
            value={props.value}
            disabled={props.disabled || false}
            onClick={() => props.onInputFocus(props.inputGroup, props.attributes.name)}
            onBlur={() => props.onInputUnfocus(props.inputGroup, props.attributes.name)}
            onChange={(event) => props.onInputChange(event, props.inputGroup)} />
        </div>
      );
    default:
      return null;
  }
};

export default memo(Input);