import { FC, memo } from 'react';
import styles from '../../styles/components/friends/activeFriend.module.scss';
import { Link } from 'react-router-dom';
import noUserImg from '../../images/no-user.jpg';

interface Props {
  id: string;
  fullName: string;
  profilePhotoUrl: string;
  onPrepareSendMessage: (friendId: string, friendFullName: string) => void;
}

const ActiveFriend: FC<Props> = (props) => {
  return (
    <div className={styles.friend}>
      <div className={styles.friend__content}>
        <div className={styles.friend__image}>
          <div className={styles.friend__image_photo}>
            <img src={props.profilePhotoUrl || noUserImg} alt="user" />
          </div>
          <div className={styles.friend__active}></div>
        </div>
        <p className={styles.friend__name}>
          {props.fullName}
        </p>
      </div>
      <div className={styles.friend__options}>
        <Link to={`/user/${props.id}`} className={styles.friend__link}>
          view profile
        </Link>
        <button
          type="button"
          className={styles.friend__msg}
          onClick={() => props.onPrepareSendMessage(props.id, props.fullName)}>
          send message
        </button>
      </div>
    </div>
  );
};

export default memo(ActiveFriend);