import { FC, memo } from 'react';
import styles from '../../styles/components/settingsPage/singlePersonBlocked.module.scss';
import noUserImg from '../../images/no-user.jpg';

interface Props {
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  onPrepareUnblockUser: (id: string, name: string) => void;
}

const SinglePersonBlocked: FC<Props> = (props) => {
  return (
    <div className={styles.blocked}>
      <div className={styles.blocked__img}>
        <img src={props.user.profilePhotoUrl || noUserImg} alt="user" />
      </div>
      <div className={styles.blocked__info}>
        <p className={styles.blocked__name}>
          {props.user.fullName}
        </p>
        <button
          type="button"
          className={styles.blocked__btn}
          onClick={() => props.onPrepareUnblockUser(props.user._id, props.user.fullName)}>
          unblock
        </button>
      </div>
    </div>
  );
};

export default memo(SinglePersonBlocked);