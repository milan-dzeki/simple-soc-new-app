import { FC, FormEvent, useState, useCallback, ChangeEvent } from 'react';
import styles from '../../styles/components/photosAndAlbums/photoSlider.module.scss';
import { Link } from 'react-router-dom';
import noUserImg from '../../images/no-user.jpg';
// types
import { IPhoto } from '../../hooks/usePhotosHook/usePhotosTypes';
// components
import LikesAndCommentsContainer from '../LikesAndComments/LikesAndCommentsContainer';
// utils
import { formatDateToYearMonthAndDay } from '../../utils/formatDateToYearMonthAndDay';
// components
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import { editPhotoDescriptionInput } from '../../config/myProfilePage/editPhotoDescriptionForm';
import EditPhotoDescriptionInput from './EditPhotoDescriptionInput';
import Backdrop from '../Shared/Backdrop';

interface Props {
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  isAuthUser?: boolean;
  albumId: string;
  displayedPhotoIndex: number;
  photos: IPhoto[];
  prevPhoto: () => void;
  nextPhoto: () => void;
  onClosePhotoSlider: () => void;
  hideLikingOption?: boolean;
  hideCommentingOption?: boolean;
  onLikePhoto: (albumId: string, photoId: string) => Promise<void>;
  onUnlikePhoto: (albumId: string, photoId: string) => Promise<void>;
  onCommentOnPhoto: (albumId: string, photoId: string, commentTextValue: string, commentPhoto: File | null, commentTaggs: {
    userId: string;
    userFullName: string;
  }[]) => Promise<void>;
  onDeletePhotoComment: (albumId: string, photoId: string, commentId: string) => Promise<void>;
  onLikePhotoComment: (albumId: string, photoId: string, commentId: string) => Promise<void>;
  onUnlikePhotoComment: (albumId: string, photoId: string, commentId: string) => Promise<void>;
  onChangePhotoDescription?: (albumId: string, photoId: string, newDescriptionValue: string) => Promise<void>;
}

const PhotoSlider: FC<Props> = (props) => {
  const  {
    onCommentOnPhoto,
    onDeletePhotoComment,
    onLikePhoto,
    onUnlikePhoto,
    onLikePhotoComment,
    onUnlikePhotoComment,
    onChangePhotoDescription
  } = props;

  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);
  const [showSmallScreenComments, setShowSmallScreenComments] = useState(false);

  const [editPhotoDescInfo, setEditPhotoDescInfo] = useState({
    show: false,
    input: {...editPhotoDescriptionInput}
  });

  const [deleteCommentInfo, setDeleteCommentInfo] = useState<{
    albumId: string | null;
    photoId: null | string;
    commentId: string | null;
  }>({
    albumId: null,
    photoId: null,
    commentId: null
  });

  const onShowSmallScreenComments = (): void => {
    setShowSmallScreenComments(true);
  };

  const onHideSmallScreenComments = useCallback((): void => {
    setShowSmallScreenComments(false);
  }, []);

  const onCloseDeleteCommentModal = (): void => {
    setDeleteCommentInfo({
      albumId: null,
      photoId: null,
      commentId: null
    });
  };

  const commentOnPhoto = useCallback(async(
    photoId: string,
    commentTextValue: string,
    commentPhoto: File | null,
    commentTaggs: {userId: string, userFullName: string}[]
  ): Promise<void> => {
    await onCommentOnPhoto(
      props.albumId!,
      photoId,
      commentTextValue,
      commentPhoto,
      commentTaggs
    );
  }, [onCommentOnPhoto, props.albumId]);

  const onPrepareDeletePhotoComment = useCallback((photoId: string, commentId: string): void => {
    if(!props.albumId) {
      setActionErrorMsg("Album not found. Try refreshing the page");
      return;
    }

    setDeleteCommentInfo({
      albumId: props.albumId,
      photoId,
      commentId
    });
  }, [props.albumId]);

  const deletePhotoComment = useCallback(async(): Promise<void> => {
    await onDeletePhotoComment(deleteCommentInfo.albumId!, deleteCommentInfo.photoId!, deleteCommentInfo.commentId!)

    onCloseDeleteCommentModal();
  }, [onDeletePhotoComment, deleteCommentInfo]);

  const likePhoto = useCallback(async(photoId: string): Promise<void> => {
    await onLikePhoto(props.albumId!, photoId);
  }, [onLikePhoto, props.albumId]);

  const unlikePhoto = useCallback(async(photoId: string): Promise<void> => {
    await onUnlikePhoto(props.albumId!, photoId);
  }, [onUnlikePhoto, props.albumId]);

  const likePhotoComment = useCallback(async(photoId: string, commentId: string): Promise<void> => {
    await onLikePhotoComment(props.albumId!, photoId, commentId);
  }, [onLikePhotoComment, props.albumId]);

  const unlikePhotoComment = useCallback(async(photoId: string, commentId: string): Promise<void> => {
    await onUnlikePhotoComment(props.albumId!, photoId, commentId);
  }, [onUnlikePhotoComment, props.albumId]);

  const onShowPhotoDescInput = (): void => {
    const descValue = props.photos[props.displayedPhotoIndex].description || "";

    setEditPhotoDescInfo(prev => {
      return {
        show: true,
        input: {
          ...prev.input,
          description: {
            ...prev.input.description,
            value: descValue,
            touched: descValue ? true : false,
            valid: descValue ? true : false
          }
        }
      };
    });
  };

  const onHidePhotoDescInput = useCallback((): void => {
    setEditPhotoDescInfo({
      show: false,
      input: {...editPhotoDescriptionInput}
    });
  }, []);

  const onEditPhotoDescInputFocused = useCallback((_: string): void => {
    setEditPhotoDescInfo(prev => {
      return {
        ...prev,
        input: {
          ...prev.input,
          description: {
            ...prev.input.description,
            focused: true,
            touched: true
          }
        }
      };
    });
  }, []);

  const onEditPhotoDescInputUnfocused = useCallback((_: string): void => {
    setEditPhotoDescInfo(prev => {
      return {
        ...prev,
        input: {
          ...prev.input,
          description: {
            ...prev.input.description,
            focused: false
          }
        }
      };
    });
  }, []);

  const onEditPhotoDescInputChanged = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, _: string): void => {
    const target = event.target;

    setEditPhotoDescInfo(prev => {
      return {
        ...prev,
        input: {
          ...prev.input,
          description: {
            ...prev.input.description,
            value: target.value,
            valid: target.value.trim().length > 0
          }
        }
      };
    });
  }, []);

  const changePhotoDescription = useCallback(async(event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setActionLoading(true);
    const value = editPhotoDescInfo.input.description.value;
    if(value.trim().length === 0) {
      setActionErrorMsg("Can't send empty description");
      setActionLoading(false);
      return;
    }
    await onChangePhotoDescription!(props.albumId!, props.photos[props.displayedPhotoIndex]._id, value);
    onHidePhotoDescInput();
    setActionLoading(false);
  }, [editPhotoDescInfo.input.description.value, props.displayedPhotoIndex, props.albumId, onChangePhotoDescription, props.photos, onHidePhotoDescInput]);

  const onClearActionErrorMsg = useCallback((): void => {
    setActionErrorMsg(null);
  }, []);

  return (
    <>
      {/* {showSmallScreenComments && (
        <Backdrop
          show={showSmallScreenComments}
          bcgColor="dark"
          onClose={onHideSmallScreenComments}
          isSmallScreenSliderBackdrop={true} />
      )} */}
      {
        actionErrorMsg !== null && (
          <DefaultModal
            show={actionErrorMsg !== null}
            isErrorModal={true}
            title="Error occured"
            text={actionErrorMsg}
            onClose={onClearActionErrorMsg}>
            <ModalBtn
              btnType="button"
              btnCustomType="btn__ok"
              btnText="OK"
              onClick={onClearActionErrorMsg} />
          </DefaultModal>
        )
      }
      {
        deleteCommentInfo.albumId !== null && deleteCommentInfo.photoId !== null && deleteCommentInfo.commentId !== null && (
          <DefaultModal
            show={deleteCommentInfo.albumId !== null && deleteCommentInfo.photoId !== null && deleteCommentInfo.commentId !== null}
            isErrorModal={false}
            title="Prepairing to delete photo comment"
            text="Are you sure you want to delete this comment?"
            onClose={onCloseDeleteCommentModal}>
            <ModalBtn
              btnType="button"
              btnCustomType="btn__cancel"
              btnText="cancel"
              onClick={onCloseDeleteCommentModal} />
            <ModalBtn
              btnType="button"
              btnCustomType="btn__confirm"
              btnText="delete"
              onClick={deletePhotoComment} />
          </DefaultModal>
        )
      }
      <div className={styles.slider}>
        {showSmallScreenComments && (
        <Backdrop
          show={showSmallScreenComments}
          bcgColor="dark"
          onClose={onHideSmallScreenComments}
          isSmallScreenSliderBackdrop={true} />
        )}
        <div className={styles.slider__content}>
          <div className={styles.slider__photo}>
            <div className={styles.slider__close_ss} onClick={props.onClosePhotoSlider}>close</div>
            <div className={styles.slider__comments_show} onClick={onShowSmallScreenComments}>show comments</div>
            <div className={styles.slider__photo_btns}>
              {
                props.displayedPhotoIndex > 0 && (
                  <button
                    type="button"
                    className={`${styles.slider__photo_btn} ${styles.slider__photo_btn_left}`}
                    onClick={props.prevPhoto}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M689 165.1L308.2 493.5c-10.9 9.4-10.9 27.5 0 37L689 858.9c14.2 12.2 35 1.2 35-18.5V183.6c0-19.7-20.8-30.7-35-18.5z"></path></svg>
                  </button>
                )
              }
              {
                props.displayedPhotoIndex < props.photos.length - 1 && (
                  <button
                    type="button"
                    className={`${styles.slider__photo_btn} ${styles.slider__photo_btn_right}`}
                    onClick={props.nextPhoto}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"></path></svg>
                  </button>
                )
              }
            </div>
            <div className={styles.slider__photo_image}>
              <img src={props.photos[props.displayedPhotoIndex].photo.secure_url} alt="userImage" />
            </div>
          </div>
          <div className={`${styles.slider__info} ${showSmallScreenComments ? styles.slider__info_ss_show : ""}`}>
            <div className={styles.slider__info_top}>
              <div className={styles.slider__info_user}>
                <div className={styles.slider__info_user_image}>
                  <img src={props.user.profilePhotoUrl || noUserImg} alt="user" />
                </div>
                <div className={styles.slider__info_user_data}>
                  <Link to={`/user/${props.user._id}`} className={styles.slider__info_user_name}>
                    {props.user.fullName}
                  </Link>
                  <p className={styles.slider__info_date}>
                    {props.photos[props.displayedPhotoIndex].createdAt ? formatDateToYearMonthAndDay(props.photos[props.displayedPhotoIndex].createdAt) : ""}
                  </p>
                </div>
              </div>
              <div className={styles.slider__close} onClick={props.onClosePhotoSlider}>close slider</div>
              <div className={styles.slider__close_comments} onClick={onHideSmallScreenComments}>close comments</div>
            </div>
            <div className={styles.slider__desc}>
              {
                props.isAuthUser && props.onChangePhotoDescription && editPhotoDescInfo.show && (
                  <EditPhotoDescriptionInput
                    show={editPhotoDescInfo.show}
                    input={editPhotoDescInfo.input}
                    loading={actionLoading}
                    onClose={onHidePhotoDescInput}
                    onEditPhotoDescInputFocused={onEditPhotoDescInputFocused}
                    onEditPhotoDescInputUnfocused={onEditPhotoDescInputUnfocused}
                    onEditPhotoDescInputChanged={onEditPhotoDescInputChanged}
                    submitDisabled={editPhotoDescInfo.input.description.valid}
                    onSubmit={changePhotoDescription} />
                )
              }
              {
                !editPhotoDescInfo.show && (
                  <p className={styles.slider__desc_text}>
                    {props.photos[props.displayedPhotoIndex].description || "No description"}
                  </p>
                )
              }
              {
                props.isAuthUser && !editPhotoDescInfo.show && (
                  <button
                    type="button"
                    className={styles.slider__desc_edit}
                    onClick={onShowPhotoDescInput}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
                  </button>
                )
              }
            </div>
            <div className={styles.slider__likes_and_comments}>
              <LikesAndCommentsContainer
                currentUserId={props.user._id}
                itemId={props.photos[props.displayedPhotoIndex]._id}
                likes={props.photos[props.displayedPhotoIndex].likes}
                comments={props.photos[props.displayedPhotoIndex].comments}
                onSubmitComment={commentOnPhoto}
                onPrepareDeleteComment={onPrepareDeletePhotoComment}
                onLikeItem={likePhoto}
                onUnlikeItem={unlikePhoto}
                onLikeComment={likePhotoComment}
                onUnlikeComment={unlikePhotoComment}
                hideLikingOption={props.hideLikingOption || false}
                hideCommentingOption={props.hideCommentingOption || false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoSlider;