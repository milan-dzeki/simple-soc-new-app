import { FC, useState, useCallback, useEffect } from 'react';
import styles from '../../styles/components/profilePages/profileFriends.module.scss';
// hooks
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useMutualFriends } from '../../hooks/useMutualFriendsHook/useMutualFriends';
import { useSendMessage } from '../../hooks/useSendMessageHook/useSendMessage';
// components
import ProfileSingleFriend from '../Friends/ProfileSingleFriend';
import Spinner from '../Shared/Spinner';
import FriendsAndUsersModal from '../Modals/FriendsAndUsersModal';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import SendMessageModal from '../ChatsAndMessages/SendMessageModal';
// redux
import { unsendFriendRequest, declineFriendRequest, acceptFriendRequest, unfriend, getFriends, clearFriendsError } from '../../store/actions/friendsActions';
import { blockUser, resetBlockState } from '../../store/actions/authActions';

interface Props {
  authLoading: boolean;
}

const ProfileMyFriends: FC<Props> = (props) => {
  const dispatch = useDispatch();

  const {
    mutualFriendsInfo,
    onOpenFriendsModal,
    onCloseFriendsModal
  } = useMutualFriends();

  const {
    sendMessageLoading,
    sendMessageErrorMsg,
    messageInfo,
    onClearSendMessageError,
    onOpenSendMessageModal,
    onCloseSendMessageModal,
    onSendMessageInputTextFocused,
    onSendMessageInputTextUnfocused,
    onSendMessageInputTextChanged,
    onSendMessageUploadPhoto,
    onDeleteSendMessagePhoto,
    onSendMessage
  } = useSendMessage();

  const friendsState = useTypedSelector(state => state.friends);
  const [activeList, setActiveList] = useState<"friends" | "sentPendingRequests" | "receivedPendingRequests">("friends");
  const { userJustBlocked } = useTypedSelector(state => state.auth);

  const [friendActionInfo, setFriendActionInfo] = useState<{
    friendOrUserId: string | null;
    friendOrUserName: string;
    action: "unfriend" | "declineRequest" | "unsendRequest" | "acceptRequest" | "block" | null;
    relationToUser: "friends" | "sentPendingRequests" | "receivedPendingRequests" | "none" | null;
    title: string;
    text: string;
  }>({
    friendOrUserId: null,
    friendOrUserName: "",
    action: null,
    relationToUser: null,
    title: "",
    text: ""
  });

  useEffect(() => {
    if(userJustBlocked) {
      dispatch(getFriends());
    } else return;

    dispatch(resetBlockState());
  }, [userJustBlocked, dispatch]);

  const openFriendsModal = useCallback((mutuals: string[], clickedFriendName: string): void => {
    const displayedFriends = friendsState.friends.filter(friend => mutuals.includes(friend.user._id));

    onOpenFriendsModal(mutuals, clickedFriendName, displayedFriends);
  }, [friendsState.friends, onOpenFriendsModal]);

  const onCloseFriendsActionModal = useCallback((): void => {
    setFriendActionInfo({
      friendOrUserId: null,
      friendOrUserName: "",
      relationToUser: null,
      action: null,
      title: "",
      text: ""
    });
  }, []);

  const onPrepareFriendOrUserAction = useCallback((id: string, name: string, action: "unfriend" | "declineRequest" | "unsendRequest" | "acceptRequest" | "block", relationToUser: "friends" | "sentPendingRequests" | "receivedPendingRequests" | "none"): void => {
    let title = "";
    let text = "";

    if(action === "unfriend") {
      title = "Prepairing to unfriend user";
      text = `Are you sure you want to remove ${name} from your friend list?`;
    } else if(action === "declineRequest") {
      title = "Prepairing to decline request";
      text = `Are you sure you want to decline friend request from ${name}?`;
    } else if(action === "unsendRequest") {
      title = "Prepairing to cancel request";
      text = `Are you sure you want to cancel friend request sent to ${name}?`;
    } else if(action === "acceptRequest") {
      title = "Prepairing to accept friend request";
      text = `Are you sure you want to accept friend request from ${name}?`;
    } else if(action === "block") {
      title = "Prepairing to block user";
      text = `Are you sure you want to block ${name}?`;
    }
    setFriendActionInfo({
      friendOrUserId: id,
      friendOrUserName: name,
      relationToUser,
      action,
      title,
      text
    });
  }, []);

  const onConfirmFriendOrUserAction = useCallback(() => {
    if(friendActionInfo.action && friendActionInfo.friendOrUserId && friendActionInfo.relationToUser) {
      if(friendActionInfo.action === "unfriend") {
        dispatch(unfriend(friendActionInfo.friendOrUserId));
      } else if(friendActionInfo.action === "declineRequest") {
        dispatch(declineFriendRequest(friendActionInfo.friendOrUserId));
      } else if(friendActionInfo.action === "unsendRequest") {
        dispatch(unsendFriendRequest(friendActionInfo.friendOrUserId));
      } else if(friendActionInfo.action === "acceptRequest") {
        dispatch(acceptFriendRequest(friendActionInfo.friendOrUserId));
      } else if(friendActionInfo.action === "block") {
        dispatch(blockUser(friendActionInfo.friendOrUserId, friendActionInfo.relationToUser));
        // dispatch(getFriends());
      }
    }

    onCloseFriendsActionModal();
  }, [friendActionInfo.action, friendActionInfo.friendOrUserId, friendActionInfo.relationToUser, onCloseFriendsActionModal, dispatch]);

  const onClearFriendsError = useCallback((): void => {
    dispatch(clearFriendsError());
  }, [dispatch]);

  if(friendsState.friendsLoading || props.authLoading) return <Spinner />;

  return (
    <>
      {messageInfo.userId !== null && messageInfo.userName !== null && (
        <SendMessageModal
          show={messageInfo.userId !== null && messageInfo.userName !== null}
          loading={sendMessageLoading}
          friendToSentMessageName={messageInfo.userName}
          onClose={onCloseSendMessageModal}
          messageTextInput={messageInfo.messageTextInput}
          onMessageTextFocused={onSendMessageInputTextFocused}
          onMessageTextUnfocused={onSendMessageInputTextUnfocused}
          onMessageTextChanged={onSendMessageInputTextChanged}
          photoFile={messageInfo.messagePhoto}
          photoPreview={messageInfo.messagePhotoPreview}
          onUploadPhoto={onSendMessageUploadPhoto}
          onRemovePhoto={onDeleteSendMessagePhoto}
          onSendMessageToUser={onSendMessage} />
      )}
      {(friendsState.friendsErrorMsg !== null || sendMessageErrorMsg !== null) && (
        <DefaultModal
          show={friendsState.friendsErrorMsg !== null || sendMessageErrorMsg !== null}
          isErrorModal={true}
          title="Error occured"
          text={friendsState.friendsErrorMsg !== null ? friendsState.friendsErrorMsg : sendMessageErrorMsg !== null ? sendMessageErrorMsg : "Error occured"}
          onClose={
            friendsState.friendsErrorMsg !== null
            ? onClearFriendsError
            : sendMessageErrorMsg !== null
            ? onClearSendMessageError
            : () => {return}
          }>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__ok"
            btnText="OK"
            onClick={
              friendsState.friendsErrorMsg !== null
              ? onClearFriendsError
              : sendMessageErrorMsg !== null
              ? onClearSendMessageError
              : () => {return}
            } />
        </DefaultModal>
      )}
      {mutualFriendsInfo.modalShow && mutualFriendsInfo.clickedFriendName && (
        <FriendsAndUsersModal
          show={mutualFriendsInfo.modalShow}
          title={`Mutual Friends with ${mutualFriendsInfo.clickedFriendName}`}
          friends={mutualFriendsInfo.mutualFriends}
          onClose={onCloseFriendsModal} />
      )}
      {friendActionInfo.friendOrUserId !== null && friendActionInfo.action !== null && (
        <DefaultModal
          show={friendActionInfo.friendOrUserId !== null && friendActionInfo.action !== null}
          isErrorModal={false}
          title={friendActionInfo.title}
          text={friendActionInfo.text}
          onClose={onCloseFriendsActionModal}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={onCloseFriendsActionModal} />
          <ModalBtn
            btnType="submit"
            btnCustomType="btn__confirm"
            btnText="yes"
            onClick={onConfirmFriendOrUserAction} />
        </DefaultModal>
      )}
      <div className={styles.friends}>
        <div className={styles.friends__btns}>
          <button
            type="button"
            className={`${styles.friends__btn} ${activeList === "friends" ? styles.friends__btn_active : ""}`}
            onClick={() => setActiveList("friends")}>
            <span>friends </span><span>({friendsState.friends.length})</span>
          </button>
          <button
            type="button"
            className={`${styles.friends__btn} ${activeList === "sentPendingRequests" ? styles.friends__btn_active : ""}`}
            onClick={() => setActiveList("sentPendingRequests")}>
            <span>sent pending requests </span><span>({friendsState.sentPendingRequests.length})</span>
          </button>
          <button
            type="button"
            className={`${styles.friends__btn} ${activeList === "receivedPendingRequests" ? styles.friends__btn_active : ""}`}
            onClick={() => setActiveList("receivedPendingRequests")}>
            <span>received pending requests </span><span>({friendsState.receivedPendingRequests.length})</span>
          </button>
        </div>
        <div className={styles.friends__list}>
          {
            friendsState[activeList].length === 0
            ? <p className={styles.friends__list_empty}>No persons in list</p>
            : friendsState[activeList].map(friend => {
              return (
                <ProfileSingleFriend
                  key={friend.user._id}
                  userRelation={activeList}
                  user={friend.user}
                  mutualFriends={friend.mutualFriends}
                  whoCanMessageUser={friend.whoCanMessageUser}
                  isAuthUserList={true}
                  onOpenFriendsModal={openFriendsModal}
                  onPrepareFriendOrUserAction={onPrepareFriendOrUserAction}
                  onOpenSendMessageModal={onOpenSendMessageModal} />
              );
            })
          }
        </div>
      </div>
    </>
  );
};

export default ProfileMyFriends;