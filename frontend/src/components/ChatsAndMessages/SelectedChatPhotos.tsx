import { FC, useState } from 'react';
import styles from '../../styles/components/chatsAndMessages/selectedChatPhotos.module.scss';
import { IMessage } from '../../store/types/chatsTypes';
import ChatPhotosSlider from './ChatPhotosSlider';

interface Props {
  show: boolean;
  photoMessages: IMessage[];
  sliderShow: boolean;
  currentPhotoIndex: number;
  onOpenPhotoSlider: (photoIndex: number) => void;
  onChatPhotoSliderClose: () => void;
  onPrevPhoto: () => void;
  onNextPhoto: () => void;
  onChatPhotosClose: () => void;
}

const SelectedChatPhotos: FC<Props> = (props) => {
  const [sliderShow, setSliderShow] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [smallScreenPhotosShow, setSmallScreenPhotosShow] = useState(false);

  // const onOpenPhotoSlider = (photoIndex: number): void => {
  //   setPhotoIndex(photoIndex);
  //   setSliderShow(true);
  // };

  // const onChatPhotoSliderClose = (): void => {
  //   setSliderShow(false);
  // };

  // const onPrevPhoto = (): void => {
  //   setPhotoIndex(prev => {
  //     if(prev === 0) return props.photoMessages.length - 1;
  //     return prev - 1;
  //   });
  // };

  // const onNextPhoto = (): void => {
  //   setPhotoIndex(prev => {
  //     if(prev === props.photoMessages.length - 1) return 0;
  //     return prev + 1;
  //   });
  // };

  return (
    <>
      {props.sliderShow && (
        <ChatPhotosSlider
          show={props.sliderShow}
          currentPhotoIndex={props.currentPhotoIndex}
          onClose={props.onChatPhotoSliderClose}
          photos={props.photoMessages}
          prevPhoto={props.onPrevPhoto}
          nextPhoto={props.onNextPhoto} />
      )}
      <section className={`${styles.photos} ${props.show ? styles.photos__show : ""}`}>
        <div className={styles.photos__title}>
          <h4>
            Chat Photos
          </h4>
          <button 
            className={styles.photos__close}
            onClick={props.onChatPhotosClose}>
            close
          </button>
        </div>
        <article className={styles.photos__list}>
          <div className={styles.photos__list_content}>
            {
              props.photoMessages.length === 0
              ? <p className={styles.photos__empty}>No Photo messages</p>
              : props.photoMessages.map(msg => ({id: msg._id, photo: msg.photo})).map((msg, i) => {
                return (
                  <div
                    key={msg.id}
                    className={styles.photo}
                    onClick={() => props.onOpenPhotoSlider(i)}>
                    <img src={msg.photo.secure_url} alt="message_photo" />
                  </div>
                );
              })
            }
          </div>
        </article>
      </section>
    </>
  );
};

export default SelectedChatPhotos;