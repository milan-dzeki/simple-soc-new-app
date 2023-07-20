import { FC, useEffect } from 'react';
import styles from '../../styles/components/profilePages/profilePhotos.module.scss';
// hooks
import { usePhotos } from '../../hooks/usePhotosHook/usePhotos';
// components
import ProfileSelectedAlbum from '../PhotosAndAlbums/ProfileSelectedAlbum';
import ProfileSingleAlbum from '../PhotosAndAlbums/ProfileSingleAlbum';
import PhotoSlider from '../PhotosAndAlbums/PhotoSlider';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import Spinner from '../Shared/Spinner';

interface Props {
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  whoCanSeePhotos: "friends" | "none" | "everyone" | "friendsOfFriends";
  friendStatus: "friends" | "none" | "sentFriendRequest" | "receivedFriendRequest";
  haveMutualFriends: boolean;
  hideLikingOption: boolean;
  hideCommentingOption: boolean;
}

const ProfileUserPhotos: FC<Props> = (props) => {
  const {
    photosLoading,
    photosErrorMsg,
    albums,
    selectedAlbum,
    photoSliderInfo,
    onGetPhotoAlbums,
    onClearPhotosError,
    onSelectPhotoAlbum,
    onUnselectPhotoAlbum,
    onOpenPhotoSlider,
    onClosePhotoSlider,
    onSliderPrevPhoto,
    onSliderNextPhoto,
    onLikePhoto,
    onUnlikePhoto,
    onCommentOnPhoto,
    onDeletePhotoComment,
    onLikePhotoComment,
    onUnlikePhotoComment
  } = usePhotos();

  useEffect(() => {
    if(props.whoCanSeePhotos === "none") {
      return;
    } 
    if(props.whoCanSeePhotos === "friends" && props.friendStatus !== "friends") {
      return;
    }
    if(props.whoCanSeePhotos === "friendsOfFriends" && props.friendStatus !== "friends" && !props.haveMutualFriends) {
      return;
    }
    onGetPhotoAlbums(`/${props.user._id}`);
  }, [onGetPhotoAlbums, props.friendStatus, props.haveMutualFriends, props.whoCanSeePhotos, props.user._id]);

  if(photosLoading) return <Spinner />;

  return (
    <>
      {photosErrorMsg && (
        <DefaultModal
          show={photosErrorMsg !== null}
          isErrorModal={true}
          title="Error occured"
          text={photosErrorMsg}
          onClose={onClearPhotosError}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__ok"
            btnText="OK"
            onClick={onClearPhotosError} />
        </DefaultModal>
      )}
      {photoSliderInfo.show && selectedAlbum && (
        <PhotoSlider
          user={props.user}
          albumId={selectedAlbum._id}
          displayedPhotoIndex={photoSliderInfo.currentPhotoIndex}
          prevPhoto={onSliderPrevPhoto}
          nextPhoto={onSliderNextPhoto}
          photos={selectedAlbum.photos}
          onClosePhotoSlider={onClosePhotoSlider}
          hideLikingOption={props.hideLikingOption || false}
          hideCommentingOption={props.hideCommentingOption || false}
          onLikePhoto={onLikePhoto}
          onUnlikePhoto={onUnlikePhoto}
          onCommentOnPhoto={onCommentOnPhoto}
          onDeletePhotoComment={onDeletePhotoComment}
          onLikePhotoComment={onLikePhotoComment}
          onUnlikePhotoComment={onUnlikePhotoComment} />
      )}
      <div className={styles.photos}>
        {
          selectedAlbum 
          ? (
            <>
              <div className={styles.photos__btns}>
                <button 
                  className={`${styles.photos__btn} ${styles.photos__btn_back}`}
                  onClick={onUnselectPhotoAlbum}>
                  <span className={styles.photos__btn_icon}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M215.469 332.802l29.863 29.864L352 256 245.332 149.333l-29.863 29.865 55.469 55.469H64v42.666h205.864l-54.395 55.469zM405.334 64H106.666C83.198 64 64 83.198 64 106.666V192h42.666v-85.333h298.668v298.668H106.666V320H64v85.334C64 428.802 83.198 448 106.666 448h298.668C428.802 448 448 428.802 448 405.334V106.666C448 83.198 428.802 64 405.334 64z"></path></svg>
                  </span>
                  <span className={styles.photos__btn_text}>
                    go back
                  </span>
                </button>
              </div>
              <ProfileSelectedAlbum
                album={selectedAlbum}
                onOpenPhotoSlider={onOpenPhotoSlider} />
            </>
          ) 
          : (
            <div className={styles.photos__albums}>
              {
                albums.length === 0
                ? <p className={styles.photos__albums_empty}>No Albums to show</p>
                : albums.map(album => {
                  return (
                    <ProfileSingleAlbum
                      key={album._id}
                      album={album}
                      onViewPhotoAlbum={onSelectPhotoAlbum} />
                  );
                })
              }
            </div>
          )
        }
      </div>
    </>
  );
};

export default ProfileUserPhotos;