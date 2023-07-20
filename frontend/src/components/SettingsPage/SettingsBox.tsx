import { FC } from 'react';
import styles from '../../styles/components/settingsPage/settingsBox.module.scss';
import { ISettingsBox, ISettingValue } from '../../types/settingsPage/settingsTypes';
import SingleSetting from './SingleSetting';
import { formaSettingsTitles } from '../../utils/settingsPage/formatSettingsTitles';

interface Props {
  title: string;
  settingsData: ISettingsBox;
  onShowSettingsOptions: (settingsGroup: string, settingsName: string) => void;
  onHideSettingsOptions: (settingsGroup: string, settingsName: string) => void;
  onEditSetting: (settingGroup: string, settingName: string, settingValue: ISettingValue) => Promise<void>;
}

const SettingsBox: FC<Props> = (props) => {
  return (
    <div className={styles.box}>
      <h2 className={styles.box__title}>
        {formaSettingsTitles(props.title)}
      </h2>
      <div className={styles.box__data}>
        {
          Object.keys(props.settingsData).length > 0
          && Object.keys(props.settingsData).map(setting => {
            return (
              <SingleSetting
                key={setting}
                settingKey={setting}
                optionsShow={props.settingsData[setting].optionsShow}
                settingValue={props.settingsData[setting].currentValue}
                settingOptions={props.settingsData[setting].options}
                onShowSettingsOptions={() => props.onShowSettingsOptions(props.title, setting)}
                onHideSettingsOptions={() => props.onHideSettingsOptions(props.title, setting)}
                onEditSetting={(settingValue: ISettingValue) => props.onEditSetting(props.title, setting, settingValue)} />
            );
          })
        }
      </div>
    </div>
  );
};

export default SettingsBox;