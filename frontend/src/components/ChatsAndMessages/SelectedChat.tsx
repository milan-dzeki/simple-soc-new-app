import { ChangeEvent, FC, FormEvent, useState, useEffect, useCallback, useRef, UIEventHandler } from 'react';
import styles from '../../styles/components/chatsAndMessages/selectedChat.module.scss';
import noUserImg from '../../images/no-user.jpg';
import moment from 'moment';
import { InView } from 'react-intersection-observer';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';
// types
import { IMessage, ISelectedChat } from '../../store/types/chatsTypes';
// components
import Spinner from '../Shared/Spinner';
import UserMessage from './UserMessage';
import MyMessage from './MyMessage';
import CloseBtn from '../Buttons/CloseBtn';
import Backdrop from '../Shared/Backdrop';

interface Props {
  loading: boolean;
  errorMsg: string | null;
  chat: ISelectedChat | null;
  photoMessages: IMessage[];
  onSendMessage: (event: FormEvent<HTMLFormElement>, messageText: string, messagePhoto: File | null) => Promise<void>;
  onMarkMessagesAsSeen: (messages: string[]) => Promise<void>;
  chatPhotosShow: boolean;
  onChatPhotosToggle: () => void;
  onOpenPhotoSlider: (photoIndex: number) => void;
  isScrolling: boolean;
  setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectedChat: FC<Props> = (props) => {
  const activeUsers = useTypedSelector(state => state.activeUsers);

  const [messageText, setMessageText] = useState("");
  const [messagePhoto, setMessagePhoto] = useState<File | null>(null);

  const [unseenVisibleMessages, setUnseenVisibleMessages] = useState<string[]>([]);
  const [emojiListShow, setEmojiListShow] = useState(false);

  const messageContainerRef = useRef<HTMLElement | null>(null);
  
  const [firstUnseenMessage, setFirstUnseenMessage] = useState<Element | null>(null);
  
  const emojiList = [
    "🙂", "😀	", "😃", "😄", "😁", "😅", "😆", "🤣", "😂", "🙃", "😉", "😊", "😇", "😎", "😍", "😘", "😝", "😐", "😮‍💨",
    "😟", "😧", "😢", "😡", "💗", "💛", "👌", "🤟", "🖕", "👍", "👎", "🙏", "💪"
  ];
    
  useEffect(() => {
    if(messageContainerRef.current && props.chat && !props.isScrolling) {
      if(props.chat.unreadMessages.length <= 1) {
        const scrollHeight = messageContainerRef.current.scrollHeight;
        messageContainerRef.current.scrollTo({top: scrollHeight}); 
      } else if(props.chat.unreadMessages.length > 0) {
        const container = messageContainerRef.current.firstElementChild;
        
        let firstUnseenMsg = Array.from(container!.children).find(c => c.classList.contains("message__delivered"));
        
        if(firstUnseenMsg) {
          setFirstUnseenMessage(firstUnseenMsg)
        }
      } 
    }
  }, [messageContainerRef, props.chat, props.isScrolling]);

  useEffect(() => {
    if(firstUnseenMessage) {
      firstUnseenMessage.scrollIntoView(false);
    }
  }, [firstUnseenMessage]);

  const isUserActive = (): boolean => {
    const activeUserIds = activeUsers.map(user => user.userId);
    if(!props.chat) return false
    if(activeUserIds.includes(props.chat.user._id)) return true;
    return false
  };

  const onOpenSlider = (msgId: string): void => {
    const targetIndex = props.photoMessages.findIndex(msg => msg._id === msgId);
    if(targetIndex !== -1) {
      props.onOpenPhotoSlider(targetIndex);
    }
  };

  const onMsgTextChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    setMessageText(target.value);
  };

  const onEmojiSelect = (emoji: string): void => {
    setMessageText(prev => `${prev} ${emoji}`);
  };

  const onMsgPhotoChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    if(target.files && target.files.length > 0) {
      setMessagePhoto(target.files[0]);
    } else {
      setMessagePhoto(null);
    }
  };

  const onRemoveMsgPhoto = (): void => {
    setMessagePhoto(null);
  };

  const onSendMessage = async(event: FormEvent<HTMLFormElement>): Promise<void> => {
    props.onSendMessage(event, messageText, messagePhoto);
    props.setIsScrolling(false);
    setMessageText("");
    setMessagePhoto(null);
  };

  const onAddToUnseenVisibleMessages = (messageId: string): void => {
    setUnseenVisibleMessages(prev => {
      if(prev.includes(messageId)) return prev;

      return prev.concat(messageId);
    });
  };

  const onMarkMessagesAsSeen = useCallback(async(): Promise<void> => {
    if(unseenVisibleMessages.length > 0) {
      await props.onMarkMessagesAsSeen(unseenVisibleMessages);
      setUnseenVisibleMessages([]);
    }
  }, [unseenVisibleMessages]);

  const onScrollMessages = useCallback((event: any): void => {
      const {scrollHeight, scrollTop, clientHeight} = event.target;
      const scroll = scrollHeight - scrollTop - clientHeight;
      if(scroll < 20) {
        props.setIsScrolling(false);
      } else {
        props.setIsScrolling(true);
      }
  }, []);

  useEffect(() => {
    let timeout: any;

    timeout = setTimeout(() =>  {
      onMarkMessagesAsSeen();
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [onMarkMessagesAsSeen]);

  const onCloseEmojiList = useCallback(() => {
    setEmojiListShow(false);
  }, []);
  

  if(props.loading) return <Spinner />;

  return (
    <>
      {emojiListShow && (
        <Backdrop
          show={emojiListShow}
          bcgColor="dark"
          onClose={onCloseEmojiList} />
      )}
      <section className={styles.chat}>
        {
          !props.chat
          ? <p className={styles.chat__emoty}>No Chat selected</p>
          : props.errorMsg 
          ? <p className={styles.chat__error}>{props.errorMsg}</p>
          : (
            <>
              <article className={styles.chat__user}>
                <div className={styles.chat__user_info}>
                  <div className={styles.chat__user_img}>
                    <img src={props.chat.user.profilePhotoUrl || noUserImg} alt="user" />
                  </div>
                  <div className={styles.chat__user_details}>
                    <p className={styles.chat__user_name}>
                      {props.chat.user.fullName}
                    </p>
                    {
                      isUserActive()
                      ? <p className={styles.chat__user_online}>online</p>
                      : <p className={styles.chat__user_last_seen}>last seen {moment(props.chat.user.lastTimeSeen).fromNow()}</p>
                    }
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.chat__user_btn}
                  onClick={props.onChatPhotosToggle}>
                  <span className={styles.chat__user_btn_icon}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 15.92c-.02.03-.06.06-.08.08H3V5.08L3.08 5h17.83c.03.02.06.06.08.08v13.84zm-10-3.41L8.5 12.5 5 17h14l-4.5-6z"></path></svg>
                  </span>
                  <span className={styles.chat__user_btn_text}>
                    {props.chatPhotosShow ? "hide" : "show"} chat photos
                  </span>
                </button>
              </article>
              <article className={styles.chat__messages} ref={messageContainerRef} onScroll={onScrollMessages}>
                <div className={styles.chat__messages_content}>
                  {
                    props.chat.messages.map((message, i) => {
                      if(message.sender._id === props.chat!.user._id) {
                        return (
                          <InView
                            key={message._id}
                            className={`message__${message.status}`}
                            onChange={(inView) => {
                              if(inView && message.status !== "seen") {
                                console.log("VIEW", message._id);
                                onAddToUnseenVisibleMessages(message._id);
                              }
                            }}>
                            <UserMessage
                              user={message.sender}
                              text={message.text}
                              photo={message.photo && message.photo.secure_url ? message.photo.secure_url : null}
                              time={message.createdAt}
                              edited={message.edited || false}
                              status={message.status}
                              onOpenPhotoSlider={message.photo ? () => onOpenSlider(message._id) : () => {return}} />
                          </InView>
                        );
                      }

                      return (
                        <MyMessage
                          key={message._id}
                          text={message.text}
                          photo={message.photo && message.photo.secure_url ? message.photo.secure_url : null}
                          time={message.createdAt}
                          edited={message.edited || false}
                          status={message.status}
                          onOpenPhotoSlider={message.photo ? () => onOpenSlider(message._id) : () => {return}} />
                      );
                    })
                  }
                </div>
              </article>
              <form className={styles.chat__form} onSubmit={onSendMessage}>
                <div className={styles.chat__form_photo}>
                  {messagePhoto && (
                    <CloseBtn
                      size="btn__small"
                      position="btn__absolute"
                      onClick={onRemoveMsgPhoto} />
                  )}
                  <label className={styles.chat__form_photo_label} htmlFor="photo">
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="photo" 
                      className={styles.chat__form_photo_input}
                      onChange={onMsgPhotoChanged} />
                    {
                      messagePhoto
                      ? (
                        <div className={styles.chat__form_photo_uploaded}>
                          <div className={styles.image}>
                            <img src={URL.createObjectURL(messagePhoto)} alt="msgPhoto" />
                          </div>
                        </div>
                      ) 
                      : (
                        <span className={styles.chat__form_photo_icon}>
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 15.92c-.02.03-.06.06-.08.08H3V5.08L3.08 5h17.83c.03.02.06.06.08.08v13.84zm-10-3.41L8.5 12.5 5 17h14l-4.5-6z"></path></svg>
                        </span>
                      )
                    }
                    <span className={styles.chat__form_photo_text}>
                      upload photo
                    </span>
                  </label>
                </div>
                <input 
                  className={styles.chat__form_text}
                  type="text"
                  placeholder="Write message"
                  value={messageText}
                  onChange={onMsgTextChanged} />
                <div className={styles.chat__form_emoji}>
                  {
                    emojiListShow && (
                      <div className={styles.chat__form_emoji_list}>
                        {emojiList.map((emoji, i) => {
                          return <p key={i} className={styles.emoji} onClick={() => onEmojiSelect(emoji)}>{emoji}</p>
                        })}
                      </div>
                    )
                  }
                  <span className={styles.chat__form_emoji_icon} onClick={() => setEmojiListShow(true)}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"></path></svg>
                  </span>
                </div>
                <button
                  type="submit"
                  className={styles.chat__form_btn}
                  disabled={messageText.trim().length === 0 && !messagePhoto}>
                  <span className={styles.chat__form_btn_icon}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path></svg>
                  </span>
                  <span className={styles.chat__form_btn_text}>
                    send message
                  </span>
                </button>
              </form>
            </>
          )
        }
      </section>
    </>
  );
};

export default SelectedChat;