import { FC, memo } from 'react';
import styles from '../../styles/components/posts/singlePost.module.scss';
import { Link } from 'react-router-dom';
import noUserImg from '../../images/no-user.jpg';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';
// types
import { IPost } from '../../types/shared/post';
// components
import LikesAndCommentsContainer from '../LikesAndComments/LikesAndCommentsContainer';
// utils
import { formatDateToFullTime } from '../../utils/formatDateToFullTime';
import { IPostPhoto } from '../../hooks/usePostsHook/usePostsTypes';

interface Props {
  post: IPost;
  onPrepareDeletePost?: (postId: string) => void;
  highlightedCommentId?: string | null;
  onCommentOnPost: (postId: string, commentTextValue: string, commentPhoto: File | null, commentTaggs: {userId: string, userFullName: string}[]) => Promise<void>;
  onPrepareDeletePostComment: (postId: string, commentId: string) => void;
  onLikePost: (postId: string) => Promise<void>;
  onUnlikePost: (postId: string) => Promise<void>;
  onLikePostComment: (postId: string, commentId: string) => Promise<void>;
  onUnlikePostComment: (postId: string, commentId: string) => Promise<void>;
  hideLikingOption?: boolean;
  hideCommentingOption?: boolean;
  homePagePost?: boolean;
  onOpenPostPhotoSlider?: (postId: string, photos: IPostPhoto[], displayedPhotoIndex: number) => void;
}

const SinglePost: FC<Props> = (props) => {
  const { authUser } = useTypedSelector(state => state.auth);

  return (
    <div className={`${styles.post} ${props.homePagePost ? styles.post__home: ""}`}>
      <div className={styles.post__user}>
        <Link className={styles.post__user_info} to={`/user/${props.post.user._id}`}>
          <span className={styles.post__user_image}>
            <img src={props.post.user.profilePhotoUrl || noUserImg} alt="user" />
          </span>
          <span className={styles.post__user_name}>
            {props.post.user.fullName}
          </span>
        </Link>
        {
          authUser && props.post.user._id === authUser._id && (
            <button
              type="button"
              className={styles.post__delete}
              onClick={() => props.onPrepareDeletePost!(props.post._id)}>
              delete post
            </button>
          )
        }
      </div>
      <div className={styles.post__data}>
        <p className={styles.post__text}>
          {props.post.text}
        </p>
        <p className={styles.post__created}>
          {formatDateToFullTime(props.post.createdAt)}
        </p>
        {props.post.taggs.length > 0 && (
          <div className={styles.post__taggs}>
            <p className={styles.post__taggs_title}>Tagged:</p>
            <div className={styles.post__taggs_list}>
              {props.post.taggs.map(tagg => {
                return (
                  <Link to={`/user/${tagg._id}`} key={tagg._id} className={styles.post__taggs_single}>
                    {tagg.fullName}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        {
          props.post.photos.length > 0 && (
            <div className={styles.post__photos}>
              <div className={styles.post__photos_content}>
                {
                  props.post.photos.map((photo, i) => {
                    return (
                      <div
                        key={photo._id}
                        className={styles.post__photo}
                        onClick={() => props.onOpenPostPhotoSlider!(props.post._id, props.post.photos, i)}>
                        <img src={photo.photo.secure_url} alt="post_image" />
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )
        }
      </div>
      <LikesAndCommentsContainer
        likes={props.post.likes}
        itemId={props.post._id}
        highlightedCommentId={props.highlightedCommentId}
        currentUserId={authUser ? authUser._id : undefined}
        comments={props.post.comments}
        onSubmitComment={props.onCommentOnPost}
        onPrepareDeleteComment={props.onPrepareDeletePostComment}
        onLikeItem={props.onLikePost}
        onUnlikeItem={props.onUnlikePost}
        onLikeComment={props.onLikePostComment}
        onUnlikeComment={props.onUnlikePostComment}
        hideLikingOption={props.hideLikingOption || false}
        hideCommentingOption={props.hideCommentingOption || false} />
    </div>
  );
};

export default memo(SinglePost);