import { FC } from 'react';
import styles from '../../styles/components/chatsAndMessages/singleMessage.module.scss';
import { formatDateToFullTime } from '../../utils/formatDateToFullTime';

interface Props {
  text: string;
  photo: string | null;
  time: Date;
  edited: boolean;
  status: "delivered" | "seen";
  onOpenPhotoSlider: () => void;
}

const MyMessage: FC<Props> = (props) => {
  return (
    <div className={`${styles.message} ${styles.message__me} ${styles[props.status]}`}>
      <div className={styles.message__content}>
        {
          props.photo && (
            <div className={styles.message__photo} onClick={props.onOpenPhotoSlider}>
              <img src={props.photo} alt="msg_photo" />
            </div>
          )
        }
        <p className={styles.message__text}>
          {props.text}
        </p>
        {
          props.status === "seen" && (
            <div className={styles.message__seen}>
              <div className={styles.message__seen_icon}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"></path><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"></path></svg>
              </div>
            </div>
          )
        }
        <p className={styles.message__time}>
          {formatDateToFullTime(props.time)}
        </p>
        
        {
          props.edited && <p className={styles.message__edited}>edited</p>
        }
      </div>
    </div>
  );
};

export default MyMessage;