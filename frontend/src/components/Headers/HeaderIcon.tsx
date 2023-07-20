import { FC, memo } from 'react';
import styles from '../../styles/components/headers/headerIcon.module.scss';

interface Props {
  popupText: string;
  numOfUnread: number;
  onClick: () => void;
}

const HeaderIcon: FC<Props> = (props) => {
  return (
    <div className={styles.icon} onClick={props.onClick}>
      <div className={styles.icon__icon}>
        {
          props.popupText === "messages"
          ? (
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path><path d="M12 12l0 .01"></path><path d="M8 12l0 .01"></path><path d="M16 12l0 .01"></path></svg>
          )
          : (
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zm-2 0v-7a6 6 0 1 0-12 0v7h12zm-9 4h6v2H9v-2z"></path></g></svg>
          )
        }
      </div>
      {props.numOfUnread > 0 && (
        <p className={styles.icon__num}>
          {props.numOfUnread}
        </p>
      )}
    </div>
  );
};

export default memo(HeaderIcon);