import { FC, useState, useEffect, useCallback } from 'react';
import styles from '../../styles/components/profilePages/profileFriends.module.scss';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useMutualFriends } from '../../hooks/useMutualFriendsHook/useMutualFriends';
import { useSendMessage } from '../../hooks/useSendMessageHook/useSendMessage';
// types 
import { IUserFriend } from '../../types/profilePages/userFriends';
// components
import ProfileSingleFriend from '../Friends/ProfileSingleFriend';
import Spinner from '../Shared/Spinner';
import FriendsAndUsersModal from '../Modals/FriendsAndUsersModal';
import SendMessageModal from '../ChatsAndMessages/SendMessageModal';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';

interface Props {
  loading: boolean;
  userFriends: IUserFriend[];
}

const ProfileUserFriends: FC<Props> = ({loading, userFriends}) => {
  const { friends, sentPendingRequests, receivedPendingRequests } = useTypedSelector(state => state.friends);
  const { authUser } = useTypedSelector(state => state.auth);
  const [activeList, setActiveList] = useState<"all" | "mutual">("all");
  const [displayedFriends, setDisplayedFriends] = useState<IUserFriend[]>([]);
  const [numOfMutualFriends, setNumOfMutualFriends] = useState(0);

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

  const getMutialFriends = useCallback(() => {
    const userFriendIds = friends.map(friend => friend.user._id);
    const mutualFriends = userFriends.filter(friend => userFriendIds.includes(friend.user._id) && friend.user._id !== authUser!._id);
    setNumOfMutualFriends(mutualFriends.length);
  }, [authUser, friends, userFriends]);

  useEffect(() => {
    setDisplayedFriends([...userFriends]);
    getMutialFriends();
  }, [getMutialFriends, userFriends]);

  const getUserRelationToAuthUser = (userId: string): "none" | "friends" | "sentPendingRequests" | "receivedPendingRequests" => {
    const isFriend = friends.find(u => u.user._id === userId);
    const isReceivedPending = receivedPendingRequests.find(u => u.user._id === userId);
    const isSentPending = sentPendingRequests.find(u => u.user._id === userId);

    if(isFriend) return "friends";
    if(isReceivedPending) return "receivedPendingRequests";
    if(isSentPending) return "sentPendingRequests";
    return "none";
  };

  const onSetDisplayedFriends = (listType: "all" | "mutual"): void => {
    if(listType === "mutual") {
      const userFriendIds = friends.map(friend => friend.user._id);
      const mutualFriends = userFriends.filter(friend => userFriendIds.includes(friend.user._id) && friend.user._id !== authUser!._id);

      setDisplayedFriends([...mutualFriends]);
    } else {
      setDisplayedFriends([...userFriends]);
    }
    setActiveList(listType);
  };

  const openFriendsModal = useCallback((mutuals: string[], clickedFriendName: string): void => {
    const displFriends = friends.filter(friend => mutuals.includes(friend.user._id));
    onOpenFriendsModal(mutuals, clickedFriendName, displFriends);
  }, [friends, onOpenFriendsModal]);

  if(loading) return <Spinner />;

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
      {sendMessageErrorMsg !== null && (
        <DefaultModal
          show={sendMessageErrorMsg !== null}
          isErrorModal={true}
          title="Error Occured"
          text={sendMessageErrorMsg}
          onClose={onClearSendMessageError}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__ok"
            btnText="OK"
            onClick={onClearSendMessageError} />
        </DefaultModal>
      )}
      {mutualFriendsInfo.modalShow && mutualFriendsInfo.clickedFriendName && (
        <FriendsAndUsersModal
          show={mutualFriendsInfo.modalShow}
          title={`Mutual Friends with ${mutualFriendsInfo.clickedFriendName}`}
          friends={mutualFriendsInfo.mutualFriends}
          onClose={onCloseFriendsModal} />
      )}
      <div className={styles.friends}>
        <div className={styles.friends__btns}>
          <button
            type="button"
            className={`${styles.friends__btn} ${activeList === "all" ? styles.friends__btn_active : ""}`}
            onClick={() => onSetDisplayedFriends("all")}>
            <span>all </span><span>({userFriends.length})</span>
          </button>
          <button
            type="button"
            className={`${styles.friends__btn} ${activeList === "mutual" ? styles.friends__btn_active : ""}`}
            onClick={() => onSetDisplayedFriends("mutual")}>
            <span>mutual </span><span>({numOfMutualFriends})</span>
          </button>
        </div>
        <div className={styles.friends__list}>
          {
            displayedFriends.length === 0
            ? <p className={styles.friends__list_empty}>No list to show</p>
            : displayedFriends.map(friend => {
              return (
                <ProfileSingleFriend
                  key={friend.user._id}
                  userRelation={getUserRelationToAuthUser(friend.user._id)}
                  user={friend.user}
                  mutualFriends={friend.mutualFriends}
                  whoCanMessageUser={friend.whoCanMessageUser}
                  onOpenFriendsModal={openFriendsModal}
                  onOpenSendMessageModal={onOpenSendMessageModal} />
              );
            })
          }
        </div>
      </div>
    </>
  );
};

export default ProfileUserFriends;