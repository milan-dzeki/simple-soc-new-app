import { FC, memo } from 'react';
import styles from '../../styles/components/shared/backdrop.module.scss';

interface Props {
  show: boolean;
  bcgColor: "dark" | "transparent";
  onClose: () => void;
  hiperZIndex?: boolean;
  isActiveFriendsBackdrop?: boolean;
  isSmallScreenSliderBackdrop?: boolean;
}

const Backdrop: FC<Props> = (props) => {
  return <div className={`${styles.backdrop} ${props.show ? styles.backdrop__show : ""} ${props.bcgColor === "transparent" ? styles.backdrop__transparent : ""} ${props.hiperZIndex ? styles.backdrop__hipervisible : ""} ${props.isActiveFriendsBackdrop ? styles.backdrop__activefr : ""} ${props.isSmallScreenSliderBackdrop ? styles.backdrop__ssslider : ""}`} onClick={props.onClose}></div>;
};

export default memo(Backdrop);