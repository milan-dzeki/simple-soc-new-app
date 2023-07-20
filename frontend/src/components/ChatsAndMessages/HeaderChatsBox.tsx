import { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/chatsAndMessages/headerChatsBox.module.scss';
import { Link } from 'react-router-dom';
// hooks
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Backdrop from '../Shared/Backdrop';
import Spinner from '../Shared/Spinner';
import SingleChatBox from './SingleChatBox';
// redux
import { getChats } from '../../store/actions/chatsActions';

interface Props {
  show: boolean;
  onCloseChatsBox: () => void;
}

const HeaderChatsBox: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { authUser, token } = useTypedSelector(state => state.auth);
  const { chatsLoading, chatsErrorMsg, chats } = useTypedSelector(state => state.chats);
  
  useEffect(() => {
    if(token && authUser) {
      dispatch(getChats());
    }
  }, [dispatch, token, authUser]);
  
  const getUserForChat = (users: {_id: string, fullName: string, profilePhotoUrl: string}[]): {_id: string, fullName: string, profilePhotoUrl: string} => {
    const user = users.find(u => u._id !== authUser!._id);
    return user!;
  };

  const getAuthUserUnreadMessages = (chatId: string): number => {
    const targetChat = chats.find(chat => chat._id === chatId);
    if(!targetChat) return 0;

    const unreadMessages = targetChat.unreadMessages.find(msgs => msgs.user === authUser!._id);
    if(!unreadMessages) return 0;

    return unreadMessages.messages.length;
  };

  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onCloseChatsBox} />
      <div className={styles.box}>
        <h4 className={styles.box__title}>
          Messages
        </h4>
        {
          !chatsLoading && (
            <div className={styles.box__btns}>
              {
                chats.length > 0 && (
                  <Link
                    to="/chats"
                    className={`${styles.box__btn} ${styles.box__btn_see}`}
                    onClick={props.onCloseChatsBox}>
                    see all chats
                  </Link>
                )
              }
              <button
                type="button"
                className={`${styles.box__btn} ${styles.box__btn_close}`}
                onClick={props.onCloseChatsBox}>
                close
              </button>
            </div>
          )
        }
        <div className={styles.box__list}>
          <div className={styles.box__list_content}>
            {
              chatsLoading
              ? <Spinner />
              : chatsErrorMsg !== null
              ? <p className={styles.box__error}>{chatsErrorMsg}</p>
              : !chatsLoading && !chatsErrorMsg && chats.length === 0
              ? <p className={styles.box__empty}>No chats yet</p>
              : chats.map(chat => {
                return (
                  <SingleChatBox
                    key={chat._id}
                    chat={chat}
                    user={getUserForChat(chat.users)}
                    numOfUnseenMessages={getAuthUserUnreadMessages(chat._id)}
                    onCloseChatsBox={props.onCloseChatsBox} />
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

export default HeaderChatsBox;