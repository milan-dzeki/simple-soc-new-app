import { FC } from 'react';
import { ISettingOption, ISettingValue } from '../../types/settingsPage/settingsTypes';
import Backdrop from '../Shared/Backdrop';
import styles from '../../styles/components/settingsPage/settingsSelectInput.module.scss'; 

interface Props {
  show: boolean;
  options: ISettingOption[];
  value: string;
  onShowSettingsOptions: () => void;
  onHideSettingsOptions: () => void;
  onEditSetting: (settingValue: ISettingValue) => Promise<void>;
}

const SettingSelectInput: FC<Props> = (props) => {
  return (
    <div className={styles.input}>
      <div className={styles.input__input} onClick={props.onShowSettingsOptions}>
        <input 
          type="text"
          readOnly
          value={props.value} />
        <div className={styles.input__icon}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>
        </div>
      </div>
      
      
      {
        props.show && (
          <>
            <Backdrop show={props.show} bcgColor="transparent" onClose={props.onHideSettingsOptions} />
            <div className={styles.input__options}>
              {props.options.map(opt => {
                return (
                  <p key={opt.dbValue} className={styles.input__opt} onClick={() => props.onEditSetting(opt.dbValue)}>
                    {opt.usedValue}
                  </p>
                )
              })}
            </div>
          </>
        )
      }
    </div>
  );
};

export default SettingSelectInput;