import { FC, useState, useEffect, useCallback } from 'react';
import axiosUser from '../axios/axiosUser';
import axiosProfile from '../axios/axiosProfile';
// hooks
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { usePosts } from '../hooks/usePostsHook/usePosts';
// types
import { IUserPageState, IUserPageResponseData } from '../types/profilePages/userProfile';
import { IProfile, IProfileResponseData } from '../types/profilePages/profileInfo';
import { IUserFriend } from '../types/profilePages/userFriends';
// components
import PageContainer from '../components/Shared/PageContainer';
import ProfileHeaderUser from '../components/ProfilePages/ProfileHeader/ProfileHeaderUser';
import DefaultModal from '../components/Modals/DefaultModal';
import ProfileDataContainer from '../components/ProfilePages/ProfileDataContainer';
import ModalBtn from '../components/Buttons/ModalBtn';
// redux
import { sendFriendRequest, unsendFriendRequest, declineFriendRequest, acceptFriendRequest, unfriend, resetRequestStatus, clearFriendsError } from '../store/actions/friendsActions';
import PostsContaniner from '../components/Posts/PostsContaniner';
import ProfileInfoUser from '../components/ProfilePages/ProfileInfoUser';
import axiosFriends from '../axios/axiosFriends';
import ProfileUserPhotos from '../components/ProfilePages/ProfileUserPhotos';
import ProfileUserFriends from '../components/ProfilePages/ProfileUserFriends';
import Spinner from '../components/Shared/Spinner';
import { removeActiveUser } from '../store/actions/activeUsersActions';

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  const {
    postsLoading,
    posts,
    onLoadPosts,
    onLikePost,
    onUnlikePost,
    onCommentOnPost,
    onDeletePostComment,
    onLikePostComment,
    onUnlikePostComment
  } = usePosts();

  const [userDataLoading, setUserDataLoading] = useState(false);
  const [userDataErrorMsg, setUserDataErrorMsg] = useState<string | null>(null);
  const { requestStatus, friendsLoading, friendsErrorMsg } = useTypedSelector(state => state.friends);
  const { authUser } = useTypedSelector(state => state.auth);
  const [userInfo, setUserInfo] = useState<IUserPageState>({
    user: null,
    settings: null,
    friendStatus: "none",
    haveMutualFriends: false
  });

  const [userProfileInfo, setUserProfileInfo] = useState<IProfile | null>(null);
  const [userFriends, setUserFriends] = useState<IUserFriend[]>([]);

  const [activeLink, setActiveLink] = useState<"posts" | "info" | "photos" | "friends">("posts");

  useEffect(() => {
    if(requestStatus === "requested") {
      setUserInfo(prev => {
        return {
          ...prev,
          friendStatus: "sentFriendRequest"
        };
      });
    } else if(requestStatus === "unsent") {
      setUserInfo(prev => {
        return {
          ...prev,
          friendStatus: "none"
        };
      });
    } else if(requestStatus === "accepted") {
      setUserInfo(prev => {
        return {
          ...prev,
          friendStatus: "friends"
        };
      });
    } else if(requestStatus === "declined") {
      setUserInfo(prev => {
        return {
          ...prev,
          friendStatus: "none"
        };
      });
    } else if(requestStatus === "unfriended") {
      setUserInfo(prev => {
        return {
          ...prev,
          friendStatus: "none"
        };
      });
    } else if(requestStatus === "idle") {
      return;
    }
    dispatch(resetRequestStatus());
  }, [requestStatus, dispatch])

  const getUserData = useCallback(async(): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");
    
    setUserDataLoading(true);
    if(!userId) {
      setUserDataErrorMsg("User not found. Try refreshing the page");
      return;
    }
    if(userId && authUser && userId === authUser._id) {
      navigate("/me", { replace: true });
      return;
    }
    try {
      const { data } = await axiosUser.get<IUserPageResponseData>(`/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserInfo({
        user: data.user,
        settings: data.userSettings,
        friendStatus: data.friendStatus,
        haveMutualFriends: data.haveMutualFriends
      });

      onLoadPosts(data.posts);
      setUserProfileInfo(null);
      setUserFriends([]);
      setActiveLink("posts");
    } catch(error) {
      setUserDataErrorMsg((error as any).response.data.message);
    }
    setUserDataLoading(false);
  }, [userId, authUser, navigate, onLoadPosts]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const onClearUserError = (): void => {
    setUserDataErrorMsg(null)
  };

  const onClearFriendsError = (): void => {
    dispatch(clearFriendsError());
  };

  const onSendFriendRequest = useCallback(async() => {
    if(userInfo.user) {
      dispatch(sendFriendRequest(userInfo.user._id));
    }
  }, [userInfo.user, dispatch]);

  const onUnsendFriendRequest = useCallback((): void => {
    if(userInfo.user) {
      dispatch(unsendFriendRequest(userInfo.user._id));
    }
  }, [userInfo.user, dispatch]);

  const onAcceptFriendRequest = useCallback((): void => {
    if(userInfo.user) {
      dispatch(acceptFriendRequest(userInfo.user._id));
    }
  }, [userInfo.user, dispatch]);

  const onDeclineFriendRequest = useCallback((): void => {
    if(userInfo.user) {
      dispatch(declineFriendRequest(userInfo.user._id));
    }
  }, [userInfo.user, dispatch]);

  const onUnfriend = useCallback((): void => {
    if(userInfo.user) {
      dispatch(unfriend(userInfo.user._id));
    }
  }, [userInfo.user, dispatch]);

  const onGetUserProfile = useCallback(async(): Promise<void> => {
    const token = localStorage.getItem("socNetAppToken");

    try {
      if(!userInfo.user || !userInfo.settings) {
        setUserDataErrorMsg("User profile not found");
        return;
      }
      if(userProfileInfo) {
        return;
      }
      setUserDataLoading(true);

      const { data } = await axiosProfile.get<IProfileResponseData>(`/${userInfo.user._id}/${userInfo.settings.profileAccess.whoCanSeeMyProfileInfo}`,  {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserProfileInfo(data.profile);
    } catch(error) {
      setUserDataErrorMsg((error as any).response.data.message);
    }
    setUserDataLoading(false);
  }, [userInfo, userProfileInfo]);

  const onGetUserFriends = useCallback(async(): Promise<void> => {
    if(!userId) {
      return setUserDataErrorMsg("Friend List not found. Try refreshing the page");
    }
    const token = localStorage.getItem("socNetAppToken");
    setUserDataLoading(true);
    try {
      const { data } = await axiosFriends.get<{status: string; friends: IUserFriend[]}>(`/userFriends/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); 
      console.log(data);
      setUserFriends(data.friends);
    } catch(error) {
      setUserDataErrorMsg((error as any).response.data.message);
    }
    setUserDataLoading(false);
  }, [userId]);

  const onChangeActiveLink = useCallback((link: "posts" | "info" | "photos" | "friends"): void => {
    if(link === "info") {
      onGetUserProfile();
    }  else if(link === "friends") {
      onGetUserFriends();
    }
    setActiveLink(link);
  }, [onGetUserProfile, onGetUserFriends]);

  if(userDataLoading) return <Spinner />;

  return (
    <>
      {(userDataErrorMsg || friendsErrorMsg) && (
        <DefaultModal
          show={userDataErrorMsg !== null || friendsErrorMsg !== null}
          isErrorModal={true}
          title="Error occured"
          text={userDataErrorMsg !== null && !friendsErrorMsg ? userDataErrorMsg : !userDataErrorMsg && friendsErrorMsg !== null ? friendsErrorMsg : "Something went wrong"}
          onClose={
            userDataErrorMsg !== null && !friendsErrorMsg
            ? onClearUserError
            : !userDataErrorMsg && friendsErrorMsg !== null
            ? onClearFriendsError
            : () => {
              onClearUserError();
              onClearFriendsError();
            }
          }>
          <ModalBtn
            btnCustomType="btn__ok"
            btnText="ok"
            btnType="button"
            onClick={userDataErrorMsg !== null && !friendsErrorMsg
              ? onClearUserError
              : !userDataErrorMsg && friendsErrorMsg !== null
              ? onClearFriendsError
              : () => {
                onClearUserError();
                onClearFriendsError();
            }} />
        </DefaultModal>
      )}
      <PageContainer
        display="container__block"
        hasPageTitle={false}
        loading={userDataLoading}
        width="big">
        {
          userInfo && userInfo.user && userInfo.settings && (
            <>
              <ProfileHeaderUser
                user={userInfo.user}
                loading={friendsLoading || userDataLoading}
                friendStatus={userInfo.friendStatus}
                haveMutualFriends={userInfo.haveMutualFriends}
                whoCanAddUser={userInfo.settings.friendRequests.whoCanAddMe}
                whoCanMessageUser={userInfo.settings.messaging.whoCanMessageMe}
                onSendFriendRequest={onSendFriendRequest}
                onUnsendFriendRequest={onUnsendFriendRequest}
                onAcceptFriendRequest={onAcceptFriendRequest}
                onDeclineFriendRequest={onDeclineFriendRequest}
                onUnfriend={onUnfriend} />
              <ProfileDataContainer
                loading={userDataLoading || friendsLoading}
                activeLink={activeLink}
                onGetUserProfile={onGetUserProfile}
                onChangeActiveLink={onChangeActiveLink}>
                {
                  activeLink === "posts" && (
                    <PostsContaniner
                      loading={postsLoading}
                      posts={posts}
                      onCommentOnPost={onCommentOnPost}
                      onDeletePostComment={onDeletePostComment}
                      onLikePost={onLikePost}
                      onUnlikePost={onUnlikePost}
                      onLikePostComment={onLikePostComment}
                      onUnlikePostComment={onUnlikePostComment}
                      hideLikingOption={
                        userInfo.settings.commentingAndLiking.whoCanLikeMyPosts === "none"
                        || (userInfo.settings.commentingAndLiking.whoCanLikeMyPosts === "friends" && userInfo.friendStatus !== "friends")
                        || (userInfo.settings.commentingAndLiking.whoCanLikeMyPosts === "friendsOfFriends" && userInfo.friendStatus !== "friends" && !userInfo.haveMutualFriends)
                        ? true
                        : false
                      }
                      hideCommentingOption={
                        userInfo.settings.commentingAndLiking.whoCanCommentMyPosts === "none"
                        || (userInfo.settings.commentingAndLiking.whoCanCommentMyPosts === "friends" && userInfo.friendStatus !== "friends")
                        || (userInfo.settings.commentingAndLiking.whoCanCommentMyPosts === "friendsOfFriends" && userInfo.friendStatus !== "friends" && !userInfo.haveMutualFriends)
                        ? true
                        : false
                      } />
                  )
                }
                {
                  activeLink === "info" && !friendsLoading && !userDataLoading && (
                    <ProfileInfoUser
                      user={userInfo.user}
                      isAuthUser={false}
                      profile={userProfileInfo} />
                  )
                }
                {
                  activeLink === "photos" && (
                    <ProfileUserPhotos
                      user={{
                        _id: userInfo.user._id,
                        fullName: userInfo.user.fullName,
                        profilePhotoUrl: userInfo.user.profilePhotoUrl
                      }}
                      whoCanSeePhotos={userInfo.settings.profileAccess.whoCanSeeMyPhotos}
                      friendStatus={userInfo.friendStatus}
                      haveMutualFriends={userInfo.haveMutualFriends}
                      hideLikingOption={
                        userInfo.settings.commentingAndLiking.whoCanLikeMyPhotos === "none"
                        || (userInfo.settings.commentingAndLiking.whoCanLikeMyPhotos === "friends" && userInfo.friendStatus !== "friends")
                        || (userInfo.settings.commentingAndLiking.whoCanLikeMyPhotos === "friendsOfFriends" && userInfo.friendStatus !== "friends" && !userInfo.haveMutualFriends)
                        ? true
                        : false
                      }
                      hideCommentingOption={
                        userInfo.settings.commentingAndLiking.whoCanCommentMyPhotos === "none"
                        || (userInfo.settings.commentingAndLiking.whoCanCommentMyPhotos === "friends" && userInfo.friendStatus !== "friends")
                        || (userInfo.settings.commentingAndLiking.whoCanCommentMyPhotos === "friendsOfFriends" && userInfo.friendStatus !== "friends" && !userInfo.haveMutualFriends)
                        ? true
                        : false
                      } />
                  )
                }
                {
                  activeLink === "friends" && !friendsLoading && !userDataLoading && (
                    <ProfileUserFriends
                      loading={userDataLoading || friendsLoading}
                      userFriends={userFriends} />
                  )
                }
              </ProfileDataContainer>
            </>
          )
        }
      </PageContainer>
    </>
  );
};

export default UserProfilePage;