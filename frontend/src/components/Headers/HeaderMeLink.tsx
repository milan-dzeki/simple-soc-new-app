import { FC } from 'react';
import styles from '../../styles/components/headers/headerMeLink.module.scss';
import { Link } from 'react-router-dom';
import noUserImg from '../../images/no-user.jpg';

interface Props {
  profilePhoto: string;
  fullName: string;
}

const HeaderMeLink: FC<Props> = (props) => {
  return (
    <Link to="/me" className={styles.link}>
      <span className={styles.link__img}>
        <img src={props.profilePhoto || noUserImg} alt="me" />
      </span>
      <span className={styles.link__text}>
        {props.fullName}
      </span>
    </Link>
  );
};

export default HeaderMeLink;