import { FC, memo, useState } from 'react';
import styles from '../../styles/components/likesAndComments/singleComment.module.scss';
import noUser from '../../images/no-user.jpg';
import { Link } from 'react-router-dom';
// types
import { IComment } from '../../types/profilePages/photoAlbum';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';
// components
import FriendsAndUsersModal from '../Modals/FriendsAndUsersModal';
// utils
import { formatDateToFullTime } from '../../utils/formatDateToFullTime';

interface Props {
  comment: IComment;
  parentId?: string;
  onPrepareDeleteComment?: (parentId: string, commentId: string) => void;
  onLikeComment?: (parentId: string, commentId: string) => Promise<void>;
  onUnlikeComment?: (parentId: string, commentId: string) => Promise<void>;
  highlightedCommentId?: boolean;
}

const SingleComment: FC<Props> = (props) => {
  const { authUser } = useTypedSelector(state => state.auth); 
  const [likesModalShow, setLikesModalShow] = useState(false);
  const [commentActionLoading, setCommentActionLoading] = useState(false);

  const hasAuthUserLikedComment = (): boolean => {
    const hasLiked = props.comment.likes.find(like => like._id === authUser!._id);
    if(hasLiked) return true;
    return false;
  };

  const onLikeOrUnlike = async() => {
    setCommentActionLoading(true);
    if(hasAuthUserLikedComment()) {
      await props.onUnlikeComment!(props.parentId!, props.comment._id);
    } else {
      await props.onLikeComment!(props.parentId!, props.comment._id);
    }
    setCommentActionLoading(false);
  };

  return (
    <>
      {likesModalShow && (
        <FriendsAndUsersModal
          show={likesModalShow}
          title="User who liked this comment"
          friends={props.comment.likes}
          onClose={() => setLikesModalShow(false)} />
      )}
      <div className={styles.comment}>
        <div className={styles.comment__user}>
          <Link to={`/user/${props.comment.commentator._id}`} className={styles.comment__user_content}>
            <div className={styles.comment__user_image}>
              <img src={props.comment.commentator.profilePhotoUrl || noUser} alt="user" />
            </div>
            <p className={styles.comment__user_name}>
              {props.comment.commentator.fullName}
            </p>
          </Link>
          {
            authUser && props.comment.commentator._id === authUser._id && (
              <button
                type="button"
                className={styles.comment__user_btn}
                onClick={() => props.onPrepareDeleteComment!(props.parentId!, props.comment._id)}>
                delete comment
              </button>
            )
          }
        </div>
        <div className={styles.comment__top}>
          <div className={styles.comment__text}>
            {props.comment.text}
          </div>
          <p className={styles.comment__date}>
            {formatDateToFullTime(props.comment.createdAt)}
          </p>
        </div>
        {
          props.comment.taggs.length > 0 && (
            <div className={styles.comment__taggs}>
              <p className={styles.comment__taggs_title}>
                tagged:
              </p>
              {props.comment.taggs.map(tagg => {
                return (
                  <Link key={tagg.userId} to={`/user/${tagg.userId}`} className={styles.comment__tagg}>{tagg.userFullName}</Link>
                );
              })}
            </div>
          )
        }
        {
          props.comment.photo && props.comment.photo.secure_url && (
            <a href={props.comment.photo.secure_url} target="__blank" key={props.comment.photo.secure_url} className={styles.comment__image}>
              <img src={props.comment.photo.secure_url} alt="user" />
            </a>
          )
        }
        <div className={styles.comment__like}>
          <div className={styles.comment__like_num} onClick={() => setLikesModalShow(true)}>
            {props.comment.likes.length} likes
          </div>
          <button
            type="button"
            className={`${styles.comment__like_btn} ${hasAuthUserLikedComment() ? styles.comment__like_btn_liked : ""}`}
            onClick={onLikeOrUnlike}
            disabled={commentActionLoading}>
            <span className={styles.comment__like_btn_icon}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path></svg>
            </span>
            <span className={styles.comment__like_btn_text}>
              {hasAuthUserLikedComment() ? "Liked" : "Like"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(SingleComment);