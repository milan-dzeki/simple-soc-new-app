import { FC } from 'react';
import styles from '../../styles/components/friends/modalSingleFriend.module.scss';
import { Link } from 'react-router-dom';
import noUSerImg from '../../images/no-user.jpg';

interface Props {
  id: string;
  fullName: string;
  profilePhotoUrl: string;
}

const ModalSingleFriend: FC<Props> = (props) => {
  return (
    <Link to={`/user/${props.id}`} className={styles.friend}>
      <div className={styles.friend__image}>
        <img src={props.profilePhotoUrl || noUSerImg} alt="user" />
      </div>
      <p className={styles.friend__name}>
        {props.fullName}
      </p>
    </Link>
  );
};

export default ModalSingleFriend;