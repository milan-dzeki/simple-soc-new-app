import { FC, useState, useEffect, useCallback } from 'react';
import axiosSettings from '../axios/axiosSettngs';
import axiosUser from '../axios/axiosUser';
// types
import { ISettingsResponseData, ISettingsPageState, ICurrentOptionValue, ISettingValue } from '../types/settingsPage/settingsTypes';
import { ISettingsPageModalState } from '../types/settingsPage/settingsPageModal';
// hooks
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
// components
import PageContainer from '../components/Shared/PageContainer';
import SettingsBox from '../components/SettingsPage/SettingsBox';
import Spinner from '../components/Shared/Spinner';
import DefaultModal from '../components/Modals/DefaultModal';
import BlockedPeopleBox from '../components/SettingsPage/BlockedPeopleBox';
// utils
import { settingsOptions } from '../config/settingsPage/settingsOptions';
import { formatSettingOptionToDB } from '../utils/settingsPage/formatSettingOption';
import AccountDeactivationBox from '../components/SettingsPage/AccountDeactivationBox';
import ModalBtn from '../components/Buttons/ModalBtn';
// redux
import { logout, deleteAccount } from '../store/actions/authActions';
import axiosAuth from '../axios/axiosAuth';

const SettingsPage: FC = () => {
  const dispatch = useDispatch();

  const { authLoading } = useTypedSelector(state => state.auth);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ISettingsPageState | null>(null);

  const [modalInfo, setModalInfo] = useState<ISettingsPageModalState>({
    show: false,
    actionType: null,
    title: "",
    text: "",
    confirmBtnText: null
  });

  const getSettings = async(): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    setSettingsLoading(true);

    try {
      const { data } = await axiosSettings.get<ISettingsResponseData>("/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      let valueToStore = {...settingsOptions};
      for(const key in data.settings) {
        for(const name in data.settings[key]) {
          if(key in valueToStore && name in valueToStore[key]) {
            valueToStore[key][name].currentValue = formatSettingOptionToDB(data.settings[key][name]) as ICurrentOptionValue;
          }
        }
      }
    
      setSettings(valueToStore);
    } catch(error) {
      setSettingsError((error as any).response.data.message);
    }

    setSettingsLoading(false);
  };

  useEffect(() => {
    getSettings();
  }, []);

  const onEditSetting = useCallback(async(settingGroup: string, settingName: string, settingValue: ISettingValue): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    setSettingsLoading(true);
    
    try {
      await axiosSettings.patch("/", {
        settingGroup, settingName, settingValue
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSettings(prev => {
        if(!prev) return prev;
        return {
          ...prev,
          [settingGroup]: {
            ...prev[settingGroup],
            [settingName]: {
              ...prev[settingGroup][settingName],
              currentValue: formatSettingOptionToDB(settingValue),
              optionsShow: false
            }
          }
        };
      });
    } catch(error) {
      setSettingsError((error as any).response.data.message);
    }
    setSettingsLoading(false);
  }, []);

  const onShowSettingsOptions = useCallback((settingsGroup: string, settingsName: string): void => {
    setSettings(prev => {
      if(!prev) return prev;
      return {
        ...prev,
        [settingsGroup]: {
          ...prev[settingsGroup],
          [settingsName]: {
            ...prev[settingsGroup][settingsName],
            optionsShow: true
          }
        }
      };
    });
  }, []);

  const onHideSettingsOptions = useCallback((settingsGroup: string, settingsName: string): void => {
    setSettings(prev => {
      if(!prev) return prev;
      return {
        ...prev,
        [settingsGroup]: {
          ...prev[settingsGroup],
          [settingsName]: {
            ...prev[settingsGroup][settingsName],
            optionsShow: false
          }
        }
      };
    });
  }, []);

  const onPrepareAccountAction = useCallback((actionType: "deactivateAccount" | "deleteAccount", title: string, text: string, confirmBtnText: "deactivate" | "delete"): void => {
    setModalInfo({
      show: true,
      actionType,
      title,
      text,
      confirmBtnText
    });
  }, []);

  const onModalClose = (): void => {
    setModalInfo({
      show: false,
      actionType: null,
      title: "",
      text: "",
      confirmBtnText: null
    });
  };

  const onDeactivateAccount = useCallback(async(): Promise<void> => {
    setSettingsLoading(true);

    if(modalInfo.actionType === "deactivateAccount") {
      const token = localStorage.getItem("socNetAppToken");
      
      try {
        await axiosUser.post("/deactivate", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        dispatch(logout());
      } catch(error) {
        setSettingsError((error as any).response.data.message);
      }
    } 
    onModalClose();
    setSettingsLoading(false);
  }, [modalInfo.actionType, dispatch]);

  const onDeleteAccount = async(): Promise<void> => {
    setSettingsLoading(true);

    if(modalInfo.actionType === "deleteAccount") {
      const token = localStorage.getItem("socNetAppToken");
      try {
        await axiosAuth.delete("/deleteAccount", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        dispatch(logout());
      } catch(error) {
        setSettingsError((error as any).response.data.message);
      }
    }
    onModalClose();
    setSettingsLoading(false);
  };

  if(authLoading || settingsLoading) return <Spinner />;

  return (
    <>
      {modalInfo.show && modalInfo.actionType && modalInfo.confirmBtnText && (
        <DefaultModal
          show={modalInfo.show && modalInfo.actionType !== null && modalInfo.confirmBtnText !== null}
          isErrorModal={false}
          title={modalInfo.title}
          text={modalInfo.text}
          onClose={onModalClose}>
          <ModalBtn
            btnCustomType="btn__cancel"
            btnType="button"
            btnText="cancel"
            onClick={onModalClose} />
          <ModalBtn
            btnCustomType="btn__confirm"
            btnText={modalInfo.confirmBtnText}
            btnType="button"
            onClick={
              modalInfo.actionType === "deactivateAccount"
              ? onDeactivateAccount
              : onDeleteAccount
            } />
        </DefaultModal>
      )}
      <PageContainer
        loading={settingsLoading}
        display="container__block"
        hasPageTitle={true}
        titleText="Settings"
        titleTextAlign="title__left"
        width="big">
        {
          settingsLoading
          ? <Spinner />
          : !settingsLoading && settings
          ? Object.keys(settings).map(setting => {
            return (
              <SettingsBox
                key={setting}
                title={setting}
                settingsData={settings[setting]}
                onShowSettingsOptions={onShowSettingsOptions}
                onHideSettingsOptions={onHideSettingsOptions}
                onEditSetting={onEditSetting} />
            );
          })
          : null
        }
      {!settingsLoading && settings && (
        <AccountDeactivationBox
          onPrepareAccountAction={onPrepareAccountAction} />
      )}
      {!settingsLoading && settings && (
        <BlockedPeopleBox />
      )}
      </PageContainer>
    </>
  );
};

export default SettingsPage;