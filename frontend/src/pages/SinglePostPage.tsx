import { FC, useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { usePosts } from '../hooks/usePostsHook/usePosts';
import { IPostPhoto } from '../hooks/usePostsHook/usePostsTypes';
import SinglePost from '../components/Posts/SinglePost';
import Spinner from '../components/Shared/Spinner';
import DefaultModal from '../components/Modals/DefaultModal';
import ModalBtn from '../components/Buttons/ModalBtn';
import PostPhotoSlider from '../components/Posts/PostPhotoSlider';

const SinglePostPage: FC = () => {
  const { postId } = useParams();

  const {
    postsLoading,
    postsErrorMsg,
    postToDeleteId,
    posts,
    onClearPostsError,
    onGetPosts,
    onPrepareDeletePost,
    onCancelDeletePost,
    onDeletePost,
    onLikePost,
    onUnlikePost,
    onCommentOnPost,
    onDeletePostComment,
    onLikePostComment,
    onUnlikePostComment
  } = usePosts();

  const location = useLocation();
  const [postErrorMsg, setPostErrorMsg] = useState<string | null>(null);

  const [postSliderInfo, setPostSliderInfo] = useState<{postId: string | null; photos: string[]; displayedPhotoIndex: number}>({
    postId: null,
    photos: [],
    displayedPhotoIndex: 0
  });

  const [deleteCommentInfo, setDeleteCommentInfo] = useState<{postId: string | null; commentId: string | null}>({
    postId: null,
    commentId: null
  });

  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);

  useEffect(() => {
    if(location.state && location.state.commentId) {
      setHighlightedCommentId(location.state.commentId);
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      window.history.replaceState({}, document.title);
    };
  }, []);

  useEffect(() => {
    if(!postId) {
      setPostErrorMsg("Post not found");
    } else {
      onGetPosts(`${postId}`);
    }
  }, [postId, onGetPosts]);

  const clearPostErrorMsg = useCallback((): void => {
    setPostErrorMsg(null);
  }, []);

  const onCloseDeletePostCommentModal = useCallback((): void => {
    setDeleteCommentInfo({
      postId: null,
      commentId: null
    });
  }, []);

  const onPrepareDeletePostComment = useCallback((postId: string, commentId: string): void => {
    setDeleteCommentInfo({
      postId,
      commentId
    });
  }, []);

  const deletePostComment = useCallback(async(): Promise<void> => {
    if(deleteCommentInfo.postId && deleteCommentInfo.commentId) {
      await onDeletePostComment(deleteCommentInfo.postId, deleteCommentInfo.commentId);
      onCloseDeletePostCommentModal();
    } else {
      setPostErrorMsg("Post id not found");
    }
  }, [deleteCommentInfo.commentId, deleteCommentInfo.postId, onCloseDeletePostCommentModal, onDeletePostComment]);

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

  return (
    <>
      {postSliderInfo.postId !== null && postSliderInfo.photos.length > 0 && (
        <PostPhotoSlider
          show={postSliderInfo.postId !== null && postSliderInfo.photos.length > 0}
          onClose={onClosePostPhotoSlider}
          photos={postSliderInfo.photos}
          displayedPhotoIndex={postSliderInfo.displayedPhotoIndex} />
      )}
      {(postErrorMsg !== null || postsErrorMsg !== null) && (
        <DefaultModal
          show={postErrorMsg !== null || postsErrorMsg !== null}
          isErrorModal={true}
          title="Error occured"
          text={
            postErrorMsg ? postErrorMsg : postsErrorMsg ? postsErrorMsg : "Error unknown"
          }
          onClose={
            postErrorMsg
            ? clearPostErrorMsg
            : postsErrorMsg
            ? onClearPostsError
            : () => {return}
          }>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__ok"
            btnText="ok"
            onClick={
              postErrorMsg
              ? clearPostErrorMsg
              : postsErrorMsg
              ? onClearPostsError
              : () => {return}
            } />
        </DefaultModal>
      )}
      {((deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null) || postToDeleteId !== null) && (
        <DefaultModal
          show={((deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null) || postToDeleteId !== null)}
          isErrorModal={false}
          title="Prepairing to delete comment"
          text="Are you sure you want to delete this post's comment?"
          onClose={
            deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null
            ? onCloseDeletePostCommentModal
            : postToDeleteId !== null
            ? onCancelDeletePost
            : () => {return}
          }>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={
              deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null
              ? onCloseDeletePostCommentModal
              : postToDeleteId !== null
              ? onCancelDeletePost
              : () => {return}
            } />
          <ModalBtn
            btnType="button"
            btnCustomType="btn__confirm"
            btnText="delete"
            onClick={
              deleteCommentInfo.postId !== null && deleteCommentInfo.commentId !== null
              ? deletePostComment
              : postToDeleteId !== null
              ? onDeletePost
              : () => {return}
            } />
        </DefaultModal>
      )}
      <main style={{margin: "2rem 0"}}>
        {
          postsLoading
          ? <Spinner />
          : posts === null || posts.length === 0
          ? <p style={{textAlign: "center", fontSize: "2rem"}}>No post found</p>
          : (
            <SinglePost
              post={posts[0]}
              highlightedCommentId={highlightedCommentId}
              onCommentOnPost={onCommentOnPost}
              onLikePost={onLikePost}
              onUnlikePost={onUnlikePost}
              onLikePostComment={onLikePostComment}
              onUnlikePostComment={onUnlikePostComment}
              onPrepareDeletePostComment={onPrepareDeletePostComment}
              onPrepareDeletePost={onPrepareDeletePost}
              onOpenPostPhotoSlider={onOpenPostPhotoSlider} />
          )
        }
        {/* {
          postsLoading
          ? <Spinner />
          : !postsLoading && posts.length > 0 && (
            <SinglePost
              post={posts[0]}
              highlightedCommentId={highlightedCommentId}
              onCommentOnPost={onCommentOnPost}
              onLikePost={onLikePost}
              onUnlikePost={onUnlikePost}
              onLikePostComment={onLikePostComment}
              onUnlikePostComment={onUnlikePostComment}
              onPrepareDeletePostComment={onPrepareDeletePostComment}
              onPrepareDeletePost={onPrepareDeletePost} />
          )
        } */}
      </main>
    </>
  );
};

export default SinglePostPage;