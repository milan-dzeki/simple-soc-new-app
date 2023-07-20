import { FC, memo } from 'react';
import styles from '../../styles/components/settingsPage/accountDeactivationBox.module.scss';

interface Props {
  onPrepareAccountAction: (actionType: "deactivateAccount" | "deleteAccount", title: string, text: string, confirmBtnText: "deactivate" | "delete") => void;
}

const AccountDeactivationBox: FC<Props> = (props) => {
  return (
    <div className={styles.box}>
      <h2 className={styles.box__title}>
        Account Deactivation / Deletion
      </h2>
      <div className={styles.box__data}>
        <button
          type="button"
          className={`${styles.box__btn} ${styles.box__btn_deact}`}
          onClick={() => props.onPrepareAccountAction("deactivateAccount", "Account Deactivation", "Are you sure you want to deactivate account? After deactivating, to activate again, just log in regularly", "deactivate")}>
          <span className={styles.box__btn_icon}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"></path><path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"></path><path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"></path></svg>
          </span>
          <span className={styles.box__btn_text}>
            Deactivate account
          </span>
        </button>
        <button
          type="button"
          className={`${styles.box__btn} ${styles.box__btn_delete}`}
          onClick={() => props.onPrepareAccountAction("deleteAccount", "Account Deletion", "Are you sure you want to delete your account? There is no going back after that.", "delete")}>
          <span className={styles.box__btn_icon}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414L13.414 14zM9 4v2h6V4H9z"></path></g></svg>
          </span>
          <span className={styles.box__btn_text}>
            Delete account
          </span>
        </button>
      </div>
    </div>
  );
};

export default memo(AccountDeactivationBox);