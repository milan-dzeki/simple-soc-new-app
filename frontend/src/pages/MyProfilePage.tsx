import { FC, useState, useCallback, useEffect } from 'react';
import axiosProfile from '../axios/axiosProfile';
// hooks
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { usePosts } from '../hooks/usePostsHook/usePosts';
// types
import { IProfile, IProfileResponseData } from '../types/profilePages/profileInfo';
import { IPhotoAlbum } from '../types/profilePages/photoAlbum';
// components
import Spinner from '../components/Shared/Spinner';
import PageContainer from '../components/Shared/PageContainer';
import ProfileHeaderMe from '../components/ProfilePages/ProfileHeader/ProfileHeaderMe';
import ProfileDataContainer from '../components/ProfilePages/ProfileDataContainer';
import ProfileInfoMe from '../components/ProfilePages/ProfileInfoMe';
import ProfileMyFriends from '../components/ProfilePages/ProfileMyFriends';
import DefaultModal from '../components/Modals/DefaultModal';
import ModalBtn from '../components/Buttons/ModalBtn';
import ProfileMyPhotos from '../components/ProfilePages/ProfileMyPhotos';
import PostsContaniner from '../components/Posts/PostsContaniner';
import CreatePostInput from '../components/Posts/CreatePostInput';
import CreatePostModal from '../components/Modals/CreatePostModal';
// redux
import { onClearAuthError } from '../store/actions/authActions';

const MyProfilePage: FC = () => {
  const dispatch = useDispatch();
  const { authUser, authLoading, authErrorMsg } = useTypedSelector(state => state.auth);
  
  const [myDataLoading, setMyDataLoading] = useState(false);
  const [myDataErrorMsg, setMyDataErrorMsg] = useState<string | null>(null);

  const [myProfileInfo, setMyProfileInfo] = useState<IProfile | null>(null);

  const [activeLink, setActiveLink] = useState<"posts" | "info" | "photos" | "friends">("posts");

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
    onGetPosts("myPosts");
  }, [onGetPosts]);

  const onGetMyProfile = useCallback(async(): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      if(myProfileInfo) {
        return;
      }

      setMyDataLoading(true);

      const { data } = await axiosProfile.get<IProfileResponseData>("/me",  {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMyProfileInfo(data.profile);
    } catch(error) {
      setMyDataErrorMsg((error as any).response.data.message);
    }
    setMyDataLoading(false);
  }, [myProfileInfo]);

  const onChangeActiveLink = useCallback((link: "posts" | "info" | "photos" | "friends"): void => {
    if(link === "info") {
      onGetMyProfile();
    } 
    setActiveLink(link);
  }, [onGetMyProfile]);

  if(authLoading) return <Spinner />;

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
          onCreatePost={onCreatePost}
        />
      )}
      {(myDataErrorMsg || authErrorMsg || postsErrorMsg) && (
        <DefaultModal
          show={myDataErrorMsg !== null || authErrorMsg !== null !== null || postsErrorMsg !== null}
          title="Error occured"
          text={myDataErrorMsg || authErrorMsg || postsErrorMsg || "something went wrong"}
          isErrorModal={true}
          onClose={
            myDataErrorMsg
            ? () => setMyDataErrorMsg(null)
            : authErrorMsg
            ? () => dispatch(onClearAuthError())
            : onClearPostsError
          }>
          <ModalBtn
            btnCustomType="btn__ok"
            btnType="button"
            btnText="ok"
            onClick={myDataErrorMsg
            ? () => setMyDataErrorMsg(null)
            : authErrorMsg
            ? () => dispatch(onClearAuthError())
            : onClearPostsError} />
        </DefaultModal>
      )}
      {postToDeleteId && (
        <DefaultModal
          loading={postsLoading}
          show={postToDeleteId !== null}
          isErrorModal={false}
          onClose={onCancelDeletePost}
          title="Preparing post deletion"
          text="Are you sure you want to delete this post?">
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={onCancelDeletePost} />
          <ModalBtn
            btnType="button"
            btnCustomType="btn__confirm"
            btnText="delete"
            onClick={onDeletePost} />
        </DefaultModal>
      )}
      <PageContainer
        display="container__block"
        hasPageTitle={false}
        loading={myDataLoading}
        width="big">
        {
          authUser && (
            <ProfileHeaderMe user={authUser} />
          )
        }
        {
          authUser && (
            <ProfileDataContainer
              loading={myDataLoading}
              activeLink={activeLink}
              onGetUserProfile={onGetMyProfile}
              onChangeActiveLink={onChangeActiveLink}>
                {
                  activeLink === "posts" && (
                    <PostsContaniner
                      loading={postsLoading}
                      posts={posts}
                      onPrepareDeletePost={onPrepareDeletePost}
                      onLikePost={onLikePost}
                      onUnlikePost={onUnlikePost}
                      onCommentOnPost={onCommentOnPost}
                      onLikePostComment={onLikePostComment}
                      onUnlikePostComment={onUnlikePostComment}
                      onDeletePostComment={onDeletePostComment}>
                      <CreatePostInput
                        onClick={onOpenCreatePostModal} />
                    </PostsContaniner>
                  )
                }
              {
                activeLink === "info" && myProfileInfo && (
                  <ProfileInfoMe
                    loading={myDataLoading}
                    user={authUser}
                    isAuthUser={true}
                    profile={myProfileInfo}
                    setMyProfileInfo={setMyProfileInfo} />
                )
              }
              {
                activeLink === "photos" && (
                  <ProfileMyPhotos
                    user={{
                      _id: authUser._id,
                      fullName: authUser.fullName,
                      profilePhotoUrl: authUser.profilePhotoUrl
                    }} />
                )
              }
              {
                activeLink === "friends" && (
                  <ProfileMyFriends authLoading={authLoading} />
                )
              }
            </ProfileDataContainer>
          )
        }
      </PageContainer>
    </>
  );
};

export default MyProfilePage;