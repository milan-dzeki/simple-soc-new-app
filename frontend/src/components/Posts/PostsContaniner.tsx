import { FC, useCallback, useState } from 'react';
import styles from '../../styles/components/posts/postsContainer.module.scss';
import { IPost } from '../../types/shared/post';
import SinglePost from './SinglePost';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import Spinner from '../Shared/Spinner';
import PostPhotoSlider from './PostPhotoSlider';
import { IPostPhoto } from '../../hooks/usePostsHook/usePostsTypes';

interface Props {
  loading?: boolean;
  children?: React.ReactNode;
  posts: IPost[];
  onPrepareDeletePost?: (postId: string) => void;
  onCommentOnPost: (postId: string, commentTextValue: string, commentPhoto: File | null, commentTaggs: {
    userId: string;
    userFullName: string; 
  }[]) => Promise<void>;
  onDeletePostComment: (postId: string, commentId: string) => Promise<void>;
  onLikePost: (postId: string) => Promise<void>;
  onUnlikePost: (postId: string) => Promise<void>;
  onLikePostComment: (postId: string, commentId: string) => Promise<void>;
  onUnlikePostComment: (postId: string, commentId: string) => Promise<void>;
  hideLikingOption?: boolean;
  hideCommentingOption?: boolean;
  homePagePosts?: boolean;
}

const PostsContaniner: FC<Props> = (props) => {
  const { onDeletePostComment } = props;

  const [postSliderInfo, setPostSliderInfo] = useState<{postId: string | null; photos: string[]; displayedPhotoIndex: number}>({
    postId: null,
    photos: [],
    displayedPhotoIndex: 0
  });

  const [deleteCommentInfo, setDeleteCommentInfo] = useState<{postId: string | null; commentId: string | null}>({
    postId: null,
    commentId: null
  });

  const onCloseDeletePostCommentModal = (): void => {
    setDeleteCommentInfo({
      postId: null,
      commentId: null
    });
  };

  const onPrepareDeletePostComment = useCallback((postId: string, commentId: string): void => {
    setDeleteCommentInfo({
      postId,
      commentId
    });
  }, []);

  const deletePostComment = useCallback(async(): Promise<void> => {
    await onDeletePostComment(deleteCommentInfo.postId!, deleteCommentInfo.commentId!);
    onCloseDeletePostCommentModal();
  }, [deleteCommentInfo, onDeletePostComment]);

  const onOpenPostPhotoSlider = useCallback((postId: string, photos: IPostPhoto[], displayedPhotoIndex: number): void => {
    const photoUrls = photos.map(photo => photo.photo.secure_url);
    setPostSliderInfo({
      postId,
      photos: photoUrls,
      displayedPhotoIndex
    });
  }, []);

  const onClosePostPhotoSlider = (): void => {
    setPostSliderInfo({
      postId: null,
      photos: [],
      displayedPhotoIndex: 0
    });
  };

  if(props.loading) return <Spinner />;

  return (
    <>
      {postSliderInfo.postId !== null && postSliderInfo.photos.length > 0 && (
        <PostPhotoSlider
          show={postSliderInfo.postId !== null && postSliderInfo.photos.length > 0}
          onClose={onClosePostPhotoSlider}
          photos={postSliderInfo.photos}
          displayedPhotoIndex={postSliderInfo.displayedPhotoIndex} />
      )}
      {deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null && (
        <DefaultModal
          show={deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null}
          isErrorModal={false}
          title="Prepairing to delete comment"
          text="Are you sure you want to delete this post's comment?"
          onClose={onCloseDeletePostCommentModal}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={onCloseDeletePostCommentModal} />
          <ModalBtn
            btnType="button"
            btnCustomType="btn__confirm"
            btnText="delete"
            onClick={deletePostComment} />
        </DefaultModal>
      )}
      <div className={styles.container}>
        {props.children || null}
        <div className={styles.container__list}>
          {
            props.posts.length === 0
            ? <p className={styles.container__list_empty}>No Posts to see</p>
            : props.posts.map(post => {
              return (
                <SinglePost
                  key={post._id}
                  post={post}
                  onPrepareDeletePost={props.onPrepareDeletePost}
                  onCommentOnPost={props.onCommentOnPost}
                  onPrepareDeletePostComment={onPrepareDeletePostComment}
                  onLikePost={props.onLikePost}
                  onUnlikePost={props.onUnlikePost}
                  onLikePostComment={props.onLikePostComment}
                  onUnlikePostComment={props.onUnlikePostComment}
                  hideLikingOption={props.hideLikingOption || false}
                  hideCommentingOption={props.hideCommentingOption || false}
                  homePagePost={props.homePagePosts || false}
                  onOpenPostPhotoSlider={onOpenPostPhotoSlider} />
              );
            })
          }
        </div>
      </div>
    </>
  );
};

export default PostsContaniner;