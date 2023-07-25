import { FC } from 'react';
import styles from '../../styles/components/authPage/authUsers.module.scss';

const AuthUsers: FC = () => {
  return (
    <div className={styles.users}>
      <p className={styles.users__text}>
        Test users' login credentials:
      </p>
      <div className={styles.users__box}>
        <div className={styles.users__user}>
          <p className={styles.users__user_text}>
            User 1:
          </p>
          <p className={styles.users__user_info}>
            <span>Email: user1@email.com ; </span>
            <span>Password: 111111</span>
          </p>
        </div>
        <div className={styles.users__user}>
          <p className={styles.users__user_text}>
            User 2:
          </p>
          <p className={styles.users__user_info}>
            <span>Email: user20@email.com ; </span>
            <span>Password: 111111</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthUsers;