import { FC, memo, lazy, useState, useEffect, useCallback } from 'react';
import styles from '../../styles/components/profilePages/profilePhotos.module.scss';
// hooks
import { usePhotos } from '../../hooks/usePhotosHook/usePhotos';
// components
import CreatePhotoAlbumModal from '../Modals/CreatePhotoAlbumModal';
import ProfileSingleAlbum from '../PhotosAndAlbums/ProfileSingleAlbum';
import ProfileSelectedAlbum from '../PhotosAndAlbums/ProfileSelectedAlbum';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import Spinner from '../Shared/Spinner';
const PhotoSlider = lazy(() => import('../PhotosAndAlbums/PhotoSlider'));

interface Props {
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
}

const ProfileMyPhotos: FC<Props> = (props) => {
  const {
    photosLoading,
    photosErrorMsg,
    albums,
    selectedAlbum,
    albumModalInfo,
    photoSliderInfo,
    onClearPhotosError,
    onGetPhotoAlbums,
    onSelectPhotoAlbum,
    onUnselectPhotoAlbum,
    onOpenPhotoAlbumModal,
    onClosePhotoAlbumModal,
    onPhotoAlbumModalInputNameFocused,
    onPhotoAlbumModalInputNameUnfocused,
    onPhotoAlbumModalInputNameChanged,
    onPhotoAlbumModalUploadPhotos,
    onPhotoAlbumModalRemovePhoto,
    onPhotoAlbumModalPhotoDescriptionChanged,
    onCreatePhotoAlbum,
    onEditAlbumName,
    onAddPhotosToAlbum,
    onDeletePhotoAlbum,
    onDeleteSinglePhotoFromPhotoAlbum,
    onOpenPhotoSlider,
    onClosePhotoSlider,
    onSliderPrevPhoto,
    onSliderNextPhoto,
    onLikePhoto,
    onUnlikePhoto,
    onCommentOnPhoto,
    onDeletePhotoComment,
    onLikePhotoComment,
    onUnlikePhotoComment,
    onChangePhotoDescription
  } = usePhotos();

  const [deleteAlbumId, setDeleteAlbumId] = useState<string | null>(null);
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);

  useEffect(() => {
    onGetPhotoAlbums("/");
  }, [onGetPhotoAlbums]);

  const onPrepareDeleteAlbum = useCallback((albumId: string): void => {
    setDeleteAlbumId(albumId);
  }, []);  


  const onPrepareDeletePhoto = useCallback((photoId: string): void => {
    setDeletePhotoId(photoId);
  }, []);

  const onDeleteAlbum = async(albumId: string): Promise<void> => {
    await onDeletePhotoAlbum(albumId);
    setDeleteAlbumId(null);
  };

  const onDeletePhoto = async(photoId: string): Promise<void> => {
    await onDeleteSinglePhotoFromPhotoAlbum(photoId);
    setDeletePhotoId(null);
  };

  if(photosLoading) return <Spinner />;

  return (
    <>
      {photoSliderInfo.show && selectedAlbum && (
        <PhotoSlider
          user={props.user}
          isAuthUser={true}
          albumId={selectedAlbum._id}
          displayedPhotoIndex={photoSliderInfo.currentPhotoIndex}
          prevPhoto={onSliderPrevPhoto}
          nextPhoto={onSliderNextPhoto}
          photos={selectedAlbum.photos}
          onClosePhotoSlider={onClosePhotoSlider}
          onLikePhoto={onLikePhoto}
          onUnlikePhoto={onUnlikePhoto}
          onCommentOnPhoto={onCommentOnPhoto}
          onDeletePhotoComment={onDeletePhotoComment}
          onLikePhotoComment={onLikePhotoComment}
          onUnlikePhotoComment={onUnlikePhotoComment}
          onChangePhotoDescription={onChangePhotoDescription} />
      )}
      {albumModalInfo.actionType !== null && (
        <CreatePhotoAlbumModal
          show={albumModalInfo.actionType !== null}
          actionType={albumModalInfo.actionType}
          onClose={onClosePhotoAlbumModal}
          albumNameInput={albumModalInfo.nameInput}
          filePreviews={albumModalInfo.photoPreviews}
          descriptions={albumModalInfo.photoDescriptions}
          formValid={albumModalInfo.modalFormValid}
          onAlbumNameInputFocused={onPhotoAlbumModalInputNameFocused}
          onAlbumNameInputUnfocused={onPhotoAlbumModalInputNameUnfocused}
          onAlbumNameInputChanged={onPhotoAlbumModalInputNameChanged}
          onUploadPhotos={onPhotoAlbumModalUploadPhotos}
          onInputDescriptionChanged={onPhotoAlbumModalPhotoDescriptionChanged}
          onRemoveSinglePhotoForUpload={onPhotoAlbumModalRemovePhoto}
          onCreatePhotoAlbum={onCreatePhotoAlbum}
          onAddPhotosToAlbum={onAddPhotosToAlbum}
          onEditAlbumName={onEditAlbumName} />
      )}
      {(deleteAlbumId || deletePhotoId) && (
        <DefaultModal
          show={deleteAlbumId !== null || deletePhotoId !== null}
          title={
            deleteAlbumId 
            ? "Prepairing album deletion"
            : deletePhotoId
            ? "Prepairing photo deletion"
            : ""
          }
          text={
            deleteAlbumId
            ? "Are you sure you want to delete this album?"
            : deletePhotoId
            ? "Are you sure you want to delete this photo?"
            : ""
          }
          isErrorModal={false}
          onClose={
            deleteAlbumId
            ? () => setDeleteAlbumId(null)
            : deletePhotoId
            ? () => setDeletePhotoId(null)
            : () => {return;}
          }>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={
              deleteAlbumId
              ? () => setDeleteAlbumId(null)
              : deletePhotoId
              ? () => setDeletePhotoId(null)
              : () => {return;}
            } />
          <ModalBtn
            btnType="submit"
            btnCustomType="btn__confirm"
            btnText="delete"
            onClick={
              deleteAlbumId
              ? () => onDeleteAlbum(deleteAlbumId)
              : deletePhotoId
              ? () => onDeletePhoto(deletePhotoId)
              : () => {return;}
            } />
        </DefaultModal>
      )}
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
                <button 
                  className={`${styles.photos__btn}`}
                  onClick={() => onOpenPhotoAlbumModal(selectedAlbum!._id, "addPhotos", null)}>
                  <span className={styles.photos__btn_icon}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M608 0H160a32 32 0 0 0-32 32v96h160V64h192v320h128a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32zM232 103a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9V73a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm352 208a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9v-30a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm0-104a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9v-30a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm0-104a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9V73a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm-168 57H32a32 32 0 0 0-32 32v288a32 32 0 0 0 32 32h384a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32zM96 224a32 32 0 1 1-32 32 32 32 0 0 1 32-32zm288 224H64v-32l64-64 32 32 128-128 96 96z"></path></svg>
                  </span>
                  <span className={styles.photos__btn_text}>
                    add photos
                  </span>
                </button>
                <button 
                  className={`${styles.photos__btn}`}
                  onClick={() => onOpenPhotoAlbumModal(selectedAlbum!._id, "editName", selectedAlbum!.albumName)}>
                  <span className={styles.photos__btn_icon}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path></svg>
                  </span>
                  <span className={styles.photos__btn_text}>
                    edit album name
                  </span>
                </button>
                <button 
                  className={`${styles.photos__btn} ${styles.photos__btn_delete}`}
                  onClick={() => onPrepareDeleteAlbum(selectedAlbum!._id)}>
                  <span className={styles.photos__btn_icon}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>
                  </span>
                  <span className={styles.photos__btn_text}>
                    delete album
                  </span>
                </button>
              </div>
              <ProfileSelectedAlbum
                album={selectedAlbum}
                isAuthUserAlbum={true}
                onPrepareDeletePhoto={onPrepareDeletePhoto}
                onOpenPhotoSlider={onOpenPhotoSlider} />
            </>
          )
          : (
            <>
              <div className={styles.photos__btns}>
                <button 
                  className={`${styles.photos__btn}`}
                  onClick={() => onOpenPhotoAlbumModal(null, "create", null)}>
                  <span className={styles.photos__btn_icon}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>
                  </span>
                  <span className={styles.photos__btn_text}>
                    create album
                  </span>
                </button>
              </div>
              <div className={styles.photos__albums}>
                {
                  albums.length === 0
                  ? <p className={styles.photos__albums_empty}>No Albums to show</p>
                  : albums.map(album => {
                    return (
                      <ProfileSingleAlbum
                        key={album._id}
                        album={album}
                        isAuthUserAlbum={true}
                        onViewPhotoAlbum={onSelectPhotoAlbum}
                        onPrepareDeleteAlbum={onPrepareDeleteAlbum}
                        onPrepareAddPhotosToAlbum={onOpenPhotoAlbumModal} />
                    );
                  })
                }
              </div>
            </>
          )
        }
      </div>
    </>
  );
};

export default memo(ProfileMyPhotos);