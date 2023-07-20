import { FC, useState, useCallback, useEffect } from 'react';
import styles from '../../styles/components/headers/mainHeader.module.scss';
import { Link } from 'react-router-dom';
import socket from '../../socketIo';
// hooks
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
// types
import { IAuthUser } from '../../store/types/authTypes';
// components
import HeaderMeLink from './HeaderMeLink';
import HeaderLink from './HeaderLink';
import HeaderIcon from './HeaderIcon';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import NotificationsBox from '../Notifications/NotificationsBox';
import HeaderChatsBox from '../ChatsAndMessages/HeaderChatsBox';
// redux
import { logout } from '../../store/actions/authActions';

interface Props {
  user: IAuthUser;
  unreadNotificationsCount: number;
  unreadChatsCount: number;
}

const Header: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const {pathname} = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationsBoxShow, setNotificationsBoxShow] = useState(false);
  const [chatsBoxShow, setChatsBoxShow] = useState(false);

  useEffect(() => {
    if(pathname) {
      setNotificationsBoxShow(false);
    }
  }, [pathname]);

  const onStartLoggingOut = (): void => {
    setLoggingOut(true);
  };

  const cancelLoggingOut = (): void => {
    setLoggingOut(false);
  };

  const onLogout = (): void => {
    socket.emit("logout", {userId: props.user._id});
    dispatch(logout());
    setLoggingOut(false);
  };

  const onShowChats = useCallback((): void => {
    setChatsBoxShow(true);
  }, []);

  const onCloseChatsBox = useCallback((): void => {
    setChatsBoxShow(false);
  }, []);

  const onShowNotifications = useCallback((): void => {
    setNotificationsBoxShow(true);
  }, []);

  const onCloseNotificationsBox = useCallback((): void => {
    setNotificationsBoxShow(false);
  }, []);

  return (
    <>
      {
        chatsBoxShow && (
          <HeaderChatsBox
            show={chatsBoxShow}
            onCloseChatsBox={onCloseChatsBox} />
        )
      }
      {
        notificationsBoxShow && (
          <NotificationsBox
            show={notificationsBoxShow}
            onCloseNotificationsBox={onCloseNotificationsBox} />
        )
      }
      {loggingOut && (
        <DefaultModal
          show={loggingOut}
          isErrorModal={false}
          title="Preparing to Logout"
          text="Are you sure you want to logout?"
          onClose={cancelLoggingOut}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={cancelLoggingOut} />
          <ModalBtn
            btnType="button"
            btnCustomType="btn__confirm"
            btnText="confirm"
            onClick={onLogout} />
        </DefaultModal>
      )}
      <header className={styles.header}>
        <section className={styles.header__bcg}></section>
        <section className={styles.header__content}>
          <Link className={styles.header__home} to="/">
            <span className={styles.header__home_icon}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path></svg>
            </span>
            <span className={styles.header__home_text}>Home</span>
          </Link>
          <article className={styles.header__links}>
            <HeaderMeLink
              profilePhoto={props.user.profilePhotoUrl}
              fullName={props.user.fullName} />
            <HeaderLink
              path="/settings"
              text="settings"
              mainHeaderLink={true} />
            <HeaderLink
              path="/logs"
              text="activity logs"
              mainHeaderLink={true} />
            <HeaderLink
              path="/search"
              text="find people"
              mainHeaderLink={true} />
            <HeaderLink
              path="/info"
              text="app info"
              mainHeaderLink={true} />
          </article>
          <article className={styles.header__buttons}>
            {pathname !== "/chats" && (
              <HeaderIcon
                popupText="messages"
                numOfUnread={props.unreadChatsCount}
                onClick={onShowChats} />
            )}
            <HeaderIcon
              popupText="notifications"
              numOfUnread={props.unreadNotificationsCount}
              onClick={onShowNotifications} />
            <button 
              type="button"
              className={styles.header__logout}
              onClick={onStartLoggingOut}>
              <span className={styles.header__logout_icon}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path><path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path></svg>
              </span>
              <span className={styles.header__logout_text}>
                logout
              </span>
            </button>
          </article>
        </section>
      </header>
    </>
  );
};

export default Header;