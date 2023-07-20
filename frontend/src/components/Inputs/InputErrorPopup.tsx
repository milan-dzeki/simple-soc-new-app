import { FC, useState, useCallback, memo } from 'react';
import styles from '../../styles/components/inputs/inputErrorPopup.module.scss';
// components
import CloseBtn from '../Buttons/CloseBtn';

interface Props {
  show: boolean;
  text: string;
}

const InputErrorPopup: FC<Props> = (props) => {
  const [errorShow, setErrorShow] = useState(true);

  const onErrorClose = useCallback((): void => {
    setErrorShow(false);
  }, []);

  return (
    <div className={`${styles.error} ${props.show && errorShow ? styles.error__show : ""}`}>
      <div className={styles.error__content}>
        <CloseBtn
          position="btn__absolute"
          size="btn__small"
          onClick={onErrorClose} />
        <div className={styles.error__pointer}></div>
        <div className={styles.error__icon}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8z"></path><path d="M11 7h2v7h-2zm0 8h2v2h-2z"></path></svg>
        </div>
        <p className={styles.error__text}>
          {props.text}
        </p>
      </div>
    </div>
  );
};

export default memo(InputErrorPopup);