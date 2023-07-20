import { FC, memo } from 'react';
import styles from '../../styles/components/photosAndAlbums/profileSelectedAlbum.module.scss';
import { IPhotoAlbum } from '../../types/profilePages/photoAlbum';

interface Props {
  album: IPhotoAlbum;
  onOpenPhotoSlider: (displayedPhotoIndex: number) => void;
  isAuthUserAlbum?: boolean;
  onPrepareDeletePhoto?: (photoId: string) => void;
}

const ProfileSelectedAlbum: FC<Props> = (props) => {
  return (
    <div className={styles.album}>
      <h4 className={styles.album__name}>
        {props.album.albumName}
      </h4>
      <div className={styles.album__photos}>
        {
          props.album.photos.length === 0
          ? <p className={styles.album__photos_empty}>No photos</p>
          : props.album.photos.map((photo, i) => {
            return (
              <div
                key={photo._id}
                className={styles.album__photo}>
                {
                  props.isAuthUserAlbum && (
                    <button 
                      className={styles.album__photo_delete}
                      onClick={() => props.onPrepareDeletePhoto!(photo._id)}>
                      delete photo
                    </button>
                  )
                }
                <img
                  src={photo.photo.secure_url} alt="albumPhoto" onClick={() => props.onOpenPhotoSlider(i)} />
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default memo(ProfileSelectedAlbum);