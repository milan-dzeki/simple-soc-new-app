import { FC, memo, useCallback, useState } from 'react';
import styles from '../../styles/components/settingsPage/blockedPeopleBox.module.scss';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
// components
import SinglePersonBlocked from './SinglePersonBlocked';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import { unblockUser } from '../../store/actions/authActions';

const BlockedPeopleBox: FC = () => {
  const dispatch = useDispatch();
  const { authUser } = useTypedSelector(state => state.auth);

  const [unblockUserInfo, setUnblockUserInfo] = useState<{id: string | null; name: string | null}>({
    id: null,
    name: null
  });

  const onPrepareUnblockUser = useCallback((id: string, name: string): void => {
    setUnblockUserInfo({
      id,
      name
    });
  }, []);

  const onCancelUnblockUser = useCallback((): void => {
    setUnblockUserInfo({
      id: null,
      name: null
    });
  }, []);

  const onUnblockUser = useCallback((): void => {
    if(unblockUserInfo.id) {
      dispatch(unblockUser(unblockUserInfo.id));
    }
    onCancelUnblockUser();
  }, [dispatch, unblockUserInfo.id, onCancelUnblockUser]);

  return (
    <>
      {
        unblockUserInfo.id !== null && unblockUserInfo.name !== null && (
          <DefaultModal
            show={unblockUserInfo.id !== null && unblockUserInfo.name !== null}
            isErrorModal={false}
            title="Preparing to unblock user"
            text={`Are you sure you want to unblock ${unblockUserInfo.name}?`}
            onClose={onCancelUnblockUser}>
            <ModalBtn
              btnType="button"
              btnCustomType="btn__cancel"
              btnText="cancel"
              onClick={onCancelUnblockUser} />
            <ModalBtn
              btnType="button"
              btnCustomType="btn__confirm"
              btnText="unblock"
              onClick={onUnblockUser} />
          </DefaultModal>
        )
      }
      <div className={styles.box}>
        <h2 className={styles.box__title}>
          People Blocked
        </h2>
        <div className={styles.box__data}>
          {
            !authUser || (authUser && authUser.blockList.length === 0)
            ? <p className={styles.box__empty}>List is empty</p>
            : authUser.blockList.map(person => {
              return (
                <SinglePersonBlocked
                  key={person._id}
                  user={person}
                  onPrepareUnblockUser={onPrepareUnblockUser} />
              );
            })
          }
        </div>
      </div>
    </>
  );
};

export default memo(BlockedPeopleBox);