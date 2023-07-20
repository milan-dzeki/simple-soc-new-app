import { FC, useState } from 'react';
import styles from '../../styles/components/buttons/profilePageHeaderBtn.module.scss';
import Backdrop from '../Shared/Backdrop';

interface Props {
  btnCustomType: "btn__friends" | "btn__add_friend" | "btn__received_friend_request" | "btn__sent_friend_request" | "btn__message" | "btn__block";
  btnText: string;
  hasDropdown: boolean;
  onClick?: (actionType: "sendFriendRequest" | "acceptFriendRequest" | "unsendFriendRequest" | "declineFriendRequest" | "unfriend" | "dropdownOpen", setDropdown?: any) => void;
}

const ProfilePageHeaderBtn: FC<Props> = (props) => {

  const [btnDropdownShow, setBtnDropdownShow] = useState(false);
  
  const onDropdownClose = (): void => {
    setBtnDropdownShow(false);
  };

  const onBtnClicked = () => {
    if(props.hasDropdown) {
      props.onClick!("dropdownOpen", setBtnDropdownShow);
    } else {
      props.onClick!("sendFriendRequest")
    }
  };

  const onDropdownBtnClicked = (actType: "acceptFriendRequest" | "unsendFriendRequest" | "declineFriendRequest" | "unfriend") => {
    props.onClick!(actType);
    onDropdownClose();
  };

  return (
    <div className={`${styles.btn} ${styles[props.btnCustomType]}`}>
      <button className={styles.btn__button} onClick={onBtnClicked}>
        <span className={styles.btn__button_icon}>
          {
            props.btnCustomType === "btn__friends"
            ? <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5"></path><path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M15 22v-4h-2l2 -6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1l2 6h-2v4"></path></svg>
            : props.btnCustomType === "btn__add_friend"
            ? <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 0 0-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 0 0-80.4 119.5A373.6 373.6 0 0 0 137 888.8a8 8 0 0 0 8 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 628.2 432.2 597 512.2 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 0 0 8.1.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 0 1 340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 0 1 683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
            : props.btnCustomType === "btn__received_friend_request"
            ? <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8 6h3v2h-3v3.5L15 18l5-4.5V17z"></path></g></svg>
            : props.btnCustomType === "btn__sent_friend_request"
            ? <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"></path><path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-4.854-1.354a.5.5 0 0 0 0 .708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708l-.647-.646.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708 0Z"></path></svg>
            : props.btnCustomType === "btn__message"
            ? <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.767L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.233V16H4V4h16v12z"></path><path d="M11 14h2v-3h3V9h-3V6h-2v3H8v2h3z"></path></svg>
            : <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 014 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0120 12c0 4.42-3.58 8-8 8z"></path></svg>
          }
        </span>
        <span className={styles.btn__button_text}>
          {props.btnText}
        </span>
        {(props.btnCustomType === "btn__friends" || props.btnCustomType === "btn__received_friend_request" || props.btnCustomType === "btn__sent_friend_request") && (
          <span className={styles.btn__button_arrow}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"></path></svg>
          </span>
        )}
      </button>
      {
        props.btnCustomType === "btn__received_friend_request"
        ? (
          <div className={`${styles.btn__dropdown} ${btnDropdownShow ? styles.btn__dropdown_block : ""}`}>
            <Backdrop
              show={btnDropdownShow}
              bcgColor="transparent"
              onClose={onDropdownClose} />
            <div className={styles.btn__dropdown_list}>
              <span onClick={() => onDropdownBtnClicked("acceptFriendRequest")}>confirm</span>
              <span onClick={() => onDropdownBtnClicked("declineFriendRequest")}>cancel</span>
            </div>
          </div>
        )
        : props.btnCustomType === "btn__sent_friend_request"
        ? (
          <div className={`${styles.btn__dropdown} ${btnDropdownShow ? styles.btn__dropdown_block : ""}`}>
            <Backdrop
              show={btnDropdownShow}
              bcgColor="transparent"
              onClose={onDropdownClose} />
            <div className={styles.btn__dropdown_list}>
              <span  onClick={() => onDropdownBtnClicked("unsendFriendRequest")}>unsend</span>
            </div>
          </div>
        )
        : props.btnCustomType === "btn__friends"
        ? (
          <div className={`${styles.btn__dropdown} ${btnDropdownShow ? styles.btn__dropdown_block : ""}`}>
            <Backdrop
              show={btnDropdownShow}
              bcgColor="transparent"
              onClose={onDropdownClose} />
            <div className={styles.btn__dropdown_list}>
              <span onClick={() => onDropdownBtnClicked("unfriend")}>unfriend</span>
            </div>
          </div>
        )
        : null
      }
    </div>
  )
}

export default ProfilePageHeaderBtn