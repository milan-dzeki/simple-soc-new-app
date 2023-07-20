import { FC } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/chatsAndMessages/chatPhotosSlider.module.scss';
import Backdrop from '../Shared/Backdrop';
import { IMessage } from '../../store/types/chatsTypes';
import { useTypedSelector } from '../../hooks/useTypedSelector';

interface Props {
  show: boolean;
  photos: IMessage[];
  currentPhotoIndex: number;
  onClose: () => void;
  prevPhoto: () => void;
  nextPhoto: () => void;
}

const ChatPhotosSlider: FC<Props> = (props) => {
  const { authUser } = useTypedSelector(state => state.auth);

  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onClose} />
      <div className={styles.slider}>
        <div className={styles.slider__content}>
          <button
            type="button"
            className={styles.slider__close}
            onClick={props.onClose}>
            close
          </button>
          <div className={styles.slider__btns}>
            <button
              type="button"
              className={`${styles.slider__btn} ${styles.slider__btn_left}`}
              onClick={props.prevPhoto}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M689 165.1L308.2 493.5c-10.9 9.4-10.9 27.5 0 37L689 858.9c14.2 12.2 35 1.2 35-18.5V183.6c0-19.7-20.8-30.7-35-18.5z"></path></svg>
            </button>
            <button
              type="button"
              className={`${styles.slider__btn} ${styles.slider__btn_right}`}
              onClick={props.nextPhoto}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"></path></svg>
            </button>
          </div>
          <div className={styles.slider__photo}>
            <div className={styles.slider__photo_img}>
              <img src={props.photos[props.currentPhotoIndex].photo.secure_url} alt="msg_photo" />
            </div>
            <div className={styles.slider__photo_info}>
              sent by {props.photos[props.currentPhotoIndex].sender._id === authUser!._id ? "you" : props.photos[props.currentPhotoIndex].sender.fullName}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default ChatPhotosSlider;