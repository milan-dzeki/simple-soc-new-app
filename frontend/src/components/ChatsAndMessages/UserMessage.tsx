import { FC } from 'react';
import styles from '../../styles/components/chatsAndMessages/singleMessage.module.scss';
import noUserImg from '../../images/no-user.jpg';
import { IChatUser } from '../../store/types/chatsTypes';
import { formatDateToFullTime } from '../../utils/formatDateToFullTime';

interface Props {
  user: IChatUser;
  text: string;
  photo: string | null;
  time: Date;
  edited: boolean;
  status: "delivered" | "seen";
  onOpenPhotoSlider: () => void;
}

const UserMessage: FC<Props> = (props) => {
  return (
    <div className={`${styles.message} ${styles.message__user} ${styles[props.status]}`}>
      <div className={styles.message__content}>
        <div className={styles.message__user_photo}>
          <img src={props.user.profilePhotoUrl || noUserImg} alt="user" />
        </div>
        <div className={styles.message__info}>
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
          <p className={styles.message__time}>
            {formatDateToFullTime(props.time)}
          </p>
          {
            props.edited && <p className={styles.message__edited}>edited</p>
          }
        </div>
      </div>
    </div>
  );
};

export default UserMessage;