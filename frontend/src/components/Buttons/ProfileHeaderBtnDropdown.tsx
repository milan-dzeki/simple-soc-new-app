import { FC } from 'react';
import styles from '../../styles/components/buttons/profileHeaderBtnDropdown.module.scss';
import Backdrop from '../Shared/Backdrop';

interface Props {
  show: boolean;
  className: "dropdown__friends" | "dropdown__received" | "dropdown__sent";
  listItems: {
    text: string;
    action: () => void;
  }[];
  onClose: () => void;
}

const ProfileHeaderBtnDropdown: FC<Props> = (props) => {
  return (
    <div className={`${styles.dropdown} ${props.show ? styles.dropdown__show : ""} ${styles[props.className]}`}>
      <Backdrop
        show={props.show}
        bcgColor="transparent"
        onClose={props.onClose} />
      <div className={styles.dropdown__list}>
        {
          props.listItems.map(item => {
            return <span key={item.text} onClick={item.action}>{item.text}</span>;
          })
        }
      </div>
    </div>
  );
};

export default ProfileHeaderBtnDropdown;