import { FC, useCallback, useState } from 'react';
import styles from '../../styles/components/chatsAndMessages/chatsBox.module.scss';
import noUserImg from '../../images/no-user.jpg';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import SingleChatBox from './SingleChatBox';
import Spinner from '../Shared/Spinner';

interface Props {
  onGetSingleChat: (chatId: string, userId: string) => Promise<void>;
}

const ChatsBox: FC<Props> = (props) => {
  const { authUser } = useTypedSelector(state => state.auth);
  const { chatsLoading, chatsErrorMsg, chats } = useTypedSelector(state => state.chats);

  const [smallScreenChatsShow, setSmallScreenChatsShow] = useState(true);

  // const [btnActive, setBtnActive] = useState<"all" | "online" | "offline">("all");

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

  const toggleChatsShow = (): void => {
    setSmallScreenChatsShow(prev => !prev);
  };

  const onGetSingleChatAndCloseSmallScreenBox = useCallback(async(chatId: string, userId: string): Promise<void> => {
    props.onGetSingleChat(chatId, userId);
    setSmallScreenChatsShow(false);
  }, []);

  return (
    <>
      <div className={`${styles.show_chats} ${smallScreenChatsShow ? styles.show_chats__visible : ""}`}>
        <div className={styles.show_chats__content}>
          <button
            type="button"
            className={styles.show_chats__btn}
            onClick={toggleChatsShow}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
          </button>
          <p className={styles.show_chats__text}>
            {smallScreenChatsShow === false ? "see chats" : "hide chats"}
          </p>
        </div>
      </div>
      <section className={`${styles.box} ${smallScreenChatsShow ? styles.box__show : ""}`}>
        {
          authUser && (
            <>
              <article className={styles.box__user}>
                <div className={styles.box__user_img}>
                  <img src={authUser.profilePhotoUrl || noUserImg} alt="user" />
                </div>
                <p className={styles.box__user_name}>
                  {authUser.fullName}
                </p>
              </article>
              {/* <article className={styles.box__filters}>
                <div className={styles.box__input}>
                  <label htmlFor="find">Search users</label>
                  <input 
                    type="text"
                    name="find"
                    id="find" />
                </div>
                <div className={styles.box__btns}>
                  <button
                    type="button"
                    className={`${styles.box__btn} ${btnActive === "all" ? styles.box__btn_actuve : ""}`}>
                    all
                  </button>
                  <button
                    type="button"
                    className={`${styles.box__btn} ${btnActive === "online" ? styles.box__btn_actuve : ""}`}>
                    online
                  </button>
                  <button
                    type="button"
                    className={`${styles.box__btn} ${btnActive === "offline" ? styles.box__btn_actuve : ""}`}>
                    offline
                  </button>
                </div>
              </article> */}
              <article className={styles.box__chats}>
                <div className={styles.box__chats_content}>
                  {
                    chatsLoading
                    ? <Spinner />
                    : !chatsLoading && chatsErrorMsg
                    ? <p className={styles.cbox__chats_error}></p>
                    : !chatsLoading && !chatsErrorMsg && chats.length === 0
                    ? <p className={styles.box__chats_empty}>No chats</p>
                    : chats.map(chat => {
                      return (
                        <SingleChatBox
                          key={chat._id}
                          chat={chat}
                          user={getUserForChat(chat.users)}
                          isChatsPageBox={true}
                          onGetSingleChat={onGetSingleChatAndCloseSmallScreenBox}
                          numOfUnseenMessages={getAuthUserUnreadMessages(chat._id)} />
                      );
                    })
                  }
                </div>
              </article>
            </>
          )
        }
      </section>
    </>
  );
};

export default ChatsBox;