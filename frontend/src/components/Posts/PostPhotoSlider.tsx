import { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/posts/postPhotoSlider.module.scss';
import Backdrop from '../Shared/Backdrop';

interface Props {
  show: boolean;
  onClose: () => void;
  photos: string[];
  displayedPhotoIndex: number;
}

const PostPhotoSlider: FC<Props> = (props) => {
  const [photoIndex, setPhotoIndex] = useState(props.displayedPhotoIndex);

  const prevPhoto = (): void => {
    setPhotoIndex(prev => {
      if(prev === 0) return prev;

      return prev - 1;
    });
  };

  const nextPhoto = (): void => {
    setPhotoIndex(prev => {
      if(prev === props.photos.length - 1) return prev;

      return prev + 1;
    });
  };
  
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
            {photoIndex > 0 && (
              <div className={`${styles.slider__btn} ${styles.slider__btn_left}`} onClick={prevPhoto}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg>
              </div>
            )}
            {photoIndex < props.photos.length - 1 && (
              <div className={`${styles.slider__btn} ${styles.slider__btn_right}`} onClick={nextPhoto}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>
              </div>
            )}
          </div>
          <div className={styles.slider__photo}>
            <img src={props.photos[photoIndex]} alt="post_photo" />
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default PostPhotoSlider;