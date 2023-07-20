import { FC } from 'react';
import styles from '../../styles/components/photosAndAlbums/singlePhoto.module.scss';
import noUserImg from '../../images/no-user.jpg';
import { IPhoto, IPhotoUser } from '../../types/profilePages/photoAlbum';
import { formatDateToFullTime } from '../../utils/formatDateToFullTime';
import LikesAndCommentsContainer from '../LikesAndComments/LikesAndCommentsContainer';
import Spinner from '../Shared/Spinner';

interface Props {
  loading: boolean;
  photo: IPhoto;
  photoUser: IPhotoUser;
  onCommentOnPhoto: (itemId: string, commentTextValue: string, commentPhoto: File | null, commentTaggs: {
    userId: string;
    userFullName: string;
  }[]) => Promise<void>;
  onLikePhoto?: () => Promise<void>;
  onUnlikePhoto?: () => Promise<void>;
  onLikePhotoComment?: (photoId: string, commentId: string) => Promise<void>;
  onUnlikePhotoComment?: (photoId: string, commentId: string) => Promise<void>;
  onPrepareDeletePhotoComment: (photoId: string, commentId: string) => void;
}

const SinglePhoto: FC<Props> = (props) => {
  return (
    <div className={styles.photo}>
      <div className={styles.photo__img}>
        <img src={props.photo.photo.secure_url} alt="photo_user" />
      </div>
      <div className={styles.photo__info}>
        <div className={styles.photo__user}>
          <div className={styles.photo__user_img}>
            <img src={props.photoUser.profilePhotoUrl || noUserImg} alt="user" />
          </div>
          <div className={styles.photo__user_info}>
            <p className={styles.photo__user_name}>
              {props.photoUser.fullName}
            </p>
            <p className={styles.photo__user_created}>
              {formatDateToFullTime(props.photo.createdAt)}
            </p>
          </div>
        </div>
        {
          props.loading
          ? <Spinner />
          : (
            <LikesAndCommentsContainer
              itemId={props.photo._id}
              comments={props.photo.comments}
              likes={props.photo.likes}
              onSubmitComment={props.onCommentOnPhoto}
              onLikeItem={props.onLikePhoto}
              onUnlikeItem={props.onUnlikePhoto}
              onLikeComment={props.onLikePhotoComment}
              onUnlikeComment={props.onUnlikePhotoComment}
              onPrepareDeleteComment={props.onPrepareDeletePhotoComment} />
          )
        }
      </div>
    </div>
  );
};

export default SinglePhoto;