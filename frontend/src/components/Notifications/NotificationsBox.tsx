import { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/notifications/notiificationsBox.module.scss';
// hooks
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../hooks/useTypedSelector';
// components
import Backdrop from '../Shared/Backdrop';
import SingleNotification from './SingleNotification';
import Spinner from '../Shared/Spinner';
// redux
import { getNotifications } from '../../store/actions/notificationsActions';

interface Props {
  show: boolean;
  onCloseNotificationsBox: () => void;
}

const NotificationsBox: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { authUser, token } = useTypedSelector(state => state.auth);
  const { notifLoading, notifErrorMsg, notifications } = useTypedSelector(state => state.notifications);
  
  useEffect(() => {
    if(token && authUser) {
      dispatch(getNotifications());
    }
  }, [dispatch, token, authUser]);
  
  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={true}
        bcgColor="dark"
        onClose={props.onCloseNotificationsBox} />
      <div className={styles.box}>
        <h4 className={styles.box__title}>
          Notifications
        </h4>
        {
          !notifLoading && (
            <div className={styles.box__btns}>
              <button
                type="button"
                className={`${styles.box__btn} ${styles.box__btn_close}`}
                onClick={props.onCloseNotificationsBox}>
                close
              </button>
            </div>
          )
        }
        <div className={styles.box__list}>
          <div className={styles.box__list_content}>
            {
              notifLoading
              ? <Spinner />
              : notifErrorMsg !== null
              ? <p className={styles.box__error}>{notifErrorMsg}. Try refreshing the page</p>
              : !notifLoading && !notifErrorMsg && notifications.length === 0
              ? <p className={styles.box__empty}>No notifications</p>
              : notifications.map(notif => {
                return (
                  <SingleNotification
                    key={notif._id}
                    notification={notif} />
                );
              })
            }
          </div>
        </div>
      </div>
    </>,
    document.getElementById("notifs") as HTMLDivElement
  );
};

export default NotificationsBox;