import { FC, memo } from 'react';
import styles from '../../styles/components/buttons/modalBtn.module.scss';

interface Props {
  btnType: "button" | "submit";
  btnCustomType: "btn__cancel" | "btn__ok" | "btn__confirm";
  btnText: string;
  disabled?: boolean;
  onClick?: () => void;
}

const ModalBtn: FC<Props> = (props) => {
  return (
    <button
      type={props.btnType}
      disabled={props.disabled || false}
      className={`${styles.btn} ${styles[props.btnCustomType]}`} onClick={props.onClick}>
      {props.btnText}
    </button>
  );
};

export default memo(ModalBtn);