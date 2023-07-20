import { FC, memo } from 'react';
import styles from '../../styles/components/settingsPage/singleSetting.module.scss';
// types
import { ISettingName, ISettingOption, ISettingValue } from '../../types/settingsPage/settingsTypes';
// components
import SettingSelectInput from './SettingSelectInput';
// utils
import { formatSettingName } from '../../utils/settingsPage/formatSettingName';

interface Props {
  settingKey: ISettingName | string;
  settingValue: string;
  optionsShow: boolean;
  settingOptions: ISettingOption[];
  onShowSettingsOptions: () => void;
  onHideSettingsOptions: () => void;
  onEditSetting: (settingValue: ISettingValue) => Promise<void>;
}

const SingleSetting: FC<Props> = (props) => {
  return (
    <div className={styles.setting}>
      <p className={styles.setting__name}>
        {formatSettingName(props.settingKey)}
      </p>
      <SettingSelectInput
        show={props.optionsShow}
        value={props.settingValue}
        options={props.settingOptions}
        onShowSettingsOptions={props.onShowSettingsOptions}
        onHideSettingsOptions={props.onHideSettingsOptions}
        onEditSetting={props.onEditSetting} />
    </div>
  );
};

export default memo(SingleSetting);