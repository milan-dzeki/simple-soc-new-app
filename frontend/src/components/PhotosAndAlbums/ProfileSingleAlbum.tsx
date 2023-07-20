import { FC, memo } from 'react';
import styles from '../../styles/components/photosAndAlbums/profileSingleAlbum.module.scss';
import { IPhotoAlbum } from '../../types/profilePages/photoAlbum';

interface Props {
  album: IPhotoAlbum;
  isAuthUserAlbum?: boolean;
  onViewPhotoAlbum: (album: IPhotoAlbum) => void;
  onPrepareDeleteAlbum?: (albumId: string) => void;
  onPrepareAddPhotosToAlbum?: (albumId: string | null, actionType: "addPhotos", targetAlbumName: string | null) => void;
}

const ProfileSingleAlbum: FC<Props> = (props) => {
  return (
    <div className={styles.album}>
      <h4 className={styles.album__name}>
        {props.album.albumName}
      </h4>
      <div className={styles.album__content}>
        <div className={styles.album__preview}>
          {
            props.album.photos.length > 0
            ? (
              <div className={styles.album__preview_photo}>
                <img src={props.album.photos[0].photo.secure_url} alt="firstPhoto" />
              </div>
            )
            : <p className={styles.album__preview_empty}>Empty album</p>
          }
          <div className={styles.album__overlay}>
            <button
              type="button"
              className={styles.album__btn}
              onClick={() => props.onViewPhotoAlbum(props.album)}>
              view album
            </button>
            {
              props.isAuthUserAlbum && (
                <>
                  <button
                    type="button"
                    className={styles.album__btn}
                    onClick={() => props.onPrepareAddPhotosToAlbum!(props.album._id, "addPhotos", null)}>
                    add photos
                  </button>
                  <button
                    type="button"
                    className={styles.album__btn}
                    onClick={props.isAuthUserAlbum ? () => props.onPrepareDeleteAlbum!(props.album._id) : () => {return}}>
                    delete album
                  </button>
                </>
              )
            }
          </div>
        </div>
        <p className={styles.album__num}>
          {props.album.photos.length} {props.album.photos.length === 1 ? "photo" : "photos"}
        </p>
      </div>
    </div>
  );
};

export default memo(ProfileSingleAlbum);