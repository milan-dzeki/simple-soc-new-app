import { FC, lazy, useEffect } from 'react';
// hooks
import { useTypedSelector } from '../hooks/useTypedSelector';
import { usePosts } from '../hooks/usePostsHook/usePosts';
// components
import HomePageContainer from '../components/HomePage/HomePageContainer';
import PostsContaniner from '../components/Posts/PostsContaniner';
import CreatePostInput from '../components/Posts/CreatePostInput';
import DefaultModal from '../components/Modals/DefaultModal';
import ModalBtn from '../components/Buttons/ModalBtn';
import Spinner from '../components/Shared/Spinner';

const CreatePostModal = lazy(() => import("../components/Modals/CreatePostModal"));

const HomePage: FC = () => {
  const { token, authLoading, initLoading } = useTypedSelector(state => state.auth);

  const {
    postsLoading,
    postsErrorMsg,
    postToDeleteId,
    posts,
    createPostData,
    onClearPostsError,
    onOpenCreatePostModal,
    onCloseCreatePostModal,
    onFocusCreatePostTextInput,
    onUnfocusCreatePostTextInput,
    onChangeCreatePostText,
    onAddCreatePostPhotos,
    onChangeCreatePostPhotoDescription,
    onRemoveCreatePostPhoto,
    onAddCreatePostTaggs,
    onRemoveCreatePostTagg,
    onCreatePost,
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

  useEffect(() => {
    if(token) {
      onGetPosts("homePosts");
    }
  }, [onGetPosts, token]);

  if(authLoading || initLoading) return <Spinner />;

  return (
    <>
      {createPostData.modalShow && (
        <CreatePostModal
          show={createPostData.modalShow}
          loading={postsLoading}
          postTextInput={createPostData.textInput}
          photoFiles={createPostData.photoFiles}
          photoPreviews={createPostData.photoPreviews}
          photoDescriptions={createPostData.photoDescriptions}
          postTaggs={createPostData.taggs}
          onAddPostTaggs={onAddCreatePostTaggs}
          onUploadPostPhotos={onAddCreatePostPhotos}
          onInputDescriptionChanged={onChangeCreatePostPhotoDescription}
          onRemoveSinglePhotoForUpload={onRemoveCreatePostPhoto}
          onRemoveSingleTagg={onRemoveCreatePostTagg}
          onPostTextInputFocused={onFocusCreatePostTextInput}
          onPostTextInputUnfocused={onUnfocusCreatePostTextInput}
          onPostTextInputChanged={onChangeCreatePostText}
          onClose={onCloseCreatePostModal}
          onCreatePost={onCreatePost} />
      )}
      {(postToDeleteId || postsErrorMsg) && !postsLoading && (
        <DefaultModal
          show={postToDeleteId !== null || postsErrorMsg !== null}
          isErrorModal={postToDeleteId !== null ? false : true}
          onClose={
            postToDeleteId !== null
            ? onCancelDeletePost
            : postsErrorMsg !== null
            ? onClearPostsError
            : () => {return}
          }
          title={
            postToDeleteId !== null
            ? "Preparing post deletion"
            : "Error occured"
          }
          text={
            postToDeleteId !== null
            ? "Are you sure you want to delete this post?"
            : postsErrorMsg !== null
            ? postsErrorMsg
            : "Something went wrong"
          }>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={
              postToDeleteId !== null
              ? onCancelDeletePost
              : postsErrorMsg !== null
              ? onClearPostsError
              : () => {return}
            } />
          {
            postToDeleteId !== null && !postsErrorMsg && (
              <ModalBtn
                btnType="button"
                btnCustomType="btn__confirm"
                btnText="delete"
                onClick={onDeletePost} />
            )
          }
        </DefaultModal>
      )}
      <HomePageContainer>
        <PostsContaniner
          loading={postsLoading}
          posts={posts}
          onPrepareDeletePost={onPrepareDeletePost}
          onLikePost={onLikePost}
          onUnlikePost={onUnlikePost}
          onCommentOnPost={onCommentOnPost}
          onLikePostComment={onLikePostComment}
          onUnlikePostComment={onUnlikePostComment}
          onDeletePostComment={onDeletePostComment}
          homePagePosts={true}>
          <CreatePostInput
            onClick={onOpenCreatePostModal}
            homePagePosts={true} />
        </PostsContaniner>
      </HomePageContainer>
    </>
  );
};

export default HomePage;