import { FC } from 'react';
import styles from '../../styles/components/chatsAndMessages/singleChatBox.module.scss';
import noUserImg from '../../images/no-user.jpg';
import { IChat } from '../../store/types/chatsTypes';
import { formatDateToFullTime } from '../../utils/formatDateToFullTime';
import { Link } from 'react-router-dom';

interface Props {
  isChatsPageBox?: boolean;
  chat: IChat;
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  onGetSingleChat?: (chatId: string, userId: string) => Promise<void>;
  numOfUnseenMessages: number;
  onCloseChatsBox?: () => void;
  chatSelectedId? : string | null;
}

const SingleChatBox: FC<Props> = (props) => {
  const innerContent = (
    <>
      <div className={styles.chat__image}>
        <img src={props.user.profilePhotoUrl || noUserImg} alt="" />
      </div>
      <div className={styles.chat__info}>
        <p className={styles.chat__username}>
          {props.user.fullName}
        </p>
        <div className={styles.chat__message}>
          <div className={styles.chat__message_text}>
            {props.chat.lastMessage.sender !== props.user._id ? <span className={styles.chat__message_text_me}>Me: </span> : ""}
            {
              props.chat.lastMessage.hasPhoto
              ? (
                <p className={styles.chat__message_photo}>
                  <span className={styles.chat__message_photo_icon}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 15.92c-.02.03-.06.06-.08.08H3V5.08L3.08 5h17.83c.03.02.06.06.08.08v13.84zm-10-3.41L8.5 12.5 5 17h14l-4.5-6z"></path></svg>
                  </span>
                  <span className={styles.chat__message_photo_text}>Photo Message</span>
                </p>
              )
              : <span>{props.chat.lastMessage.text.length > 25 ? props.chat.lastMessage.text.substring(0, 20) + " ...": props.chat.lastMessage.text}</span>
            }
            {
              props.chat.lastMessage.status === "seen" && props.chat.lastMessage.sender !== props.user._id && (
                <span className={styles.chat__message_status}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"></path><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"></path></svg>
                </span>
              )
            }
          </div>
        </div>
      </div>
      {
        props.numOfUnseenMessages > 0 && (
          <p className={styles.chat__unseen}>
            {props.numOfUnseenMessages}
          </p>
        )
      }
      <p className={styles.chat__time}>
        {formatDateToFullTime(props.chat.lastMessage.time)}
      </p>
    </>
  );


  return props.isChatsPageBox
  ? (
    <div className={`${styles.chat} ${props.isChatsPageBox ? styles.chat__cp : ""} ${props.chatSelectedId === props.chat._id ? styles.chat__selected : ""}`} onClick={() => props.onGetSingleChat!(props.chat._id, props.user._id)}>
      {innerContent}
    </div>
  )
  : (
    <Link className={styles.chat} to="/chats" state={{clickedChatId: props.chat._id, userId: props.user._id}} onClick={props.onCloseChatsBox}>
      {innerContent}
    </Link>
  )
};

export default SingleChatBox;