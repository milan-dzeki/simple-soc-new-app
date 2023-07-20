import { FC, memo } from 'react';
import styles from '../../../styles/components/profilePages/profileHeader.module.scss';
// types
import { IAuthUser } from '../../../store/types/authTypes';
// components
import ProfileHeaderUserInfo from './ProfileHeaderUserInfo';

interface Props {
  user: IAuthUser;
}

const ProfileHeaderMe: FC<Props> = (props) => {
  return (
    <section className={`${styles.header} ${styles.header__auth}`}>
      <ProfileHeaderUserInfo user={props.user} isAuthUser={true} />
    </section>
  );
};

export default memo(ProfileHeaderMe);