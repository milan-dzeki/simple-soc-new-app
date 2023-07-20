import { FC } from 'react';
import styles from '../../styles/components/buttons/iconBtn.module.scss';

interface Props {
  icon: React.ReactNode;
  color: "btn__red" | "btn__blue";
  text: string;
  onClick?: () => void;
}

const IconBtn: FC<Props> = (props) => {
  return (
    <div className={`${styles.btn} ${styles[props.color]}`} onClick={props.onClick}>
      <div className={styles.btn__icon}>
        {props.icon}
      </div>
      <p className={styles.btn__text}>
        {props.text}
      </p>
    </div>
  );
};

export default IconBtn;