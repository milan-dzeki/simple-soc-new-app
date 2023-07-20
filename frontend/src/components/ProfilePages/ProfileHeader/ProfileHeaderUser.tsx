import { FC, useCallback, useState, useEffect } from 'react';
import styles from '../../../styles/components/profilePages/profileHeader.module.scss';
// types
import { IUser } from '../../../types/profilePages/userProfile';
import { IUserPageState } from '../../../types/profilePages/userProfile';
// hooks
import { useSendMessage } from '../../../hooks/useSendMessageHook/useSendMessage';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// components
import Spinner from '../../Shared/Spinner';
import ProfileHeaderBtn from '../../Buttons/ProfileHeaderBtn';
import ProfileHeaderBtnDropdown from '../../Buttons/ProfileHeaderBtnDropdown';
import ProfileHeaderUserInfo from './ProfileHeaderUserInfo';
import SendMessageModal from '../../ChatsAndMessages/SendMessageModal';
import DefaultModal from '../../Modals/DefaultModal';
import ModalBtn from '../../Buttons/ModalBtn';
// redux
import { blockUser, onClearAuthError, resetBlockState } from '../../../store/actions/authActions';
import { getFriends } from '../../../store/actions/friendsActions';

interface Props {
  user: IUser;
  loading: boolean;
  friendStatus: IUserPageState["friendStatus"];
  whoCanAddUser: "none" | "everyone" | "friendsOfFriends";
  whoCanMessageUser: "friends" | "everyone" | "friendsOfFriends";
  haveMutualFriends: boolean;
  onSendFriendRequest: () => void;
  onUnsendFriendRequest: () => void;
  onAcceptFriendRequest: () => void;
  onDeclineFriendRequest: () => void;
  onUnfriend: () => void;
}

const ProfileHeaderUser: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authLoading, authErrorMsg, userJustBlocked } = useTypedSelector(state => state.auth);
  const [btnDropdownShow, setBtnDropdownShow] = useState(false);
  const [readyToBlockUser, setReadyToBlockUser] = useState(false);

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

  useEffect(() => {
    if(userJustBlocked) {
      navigate("/", { replace: true });
      dispatch(getFriends());
    } else {
      return;
    }

    dispatch(resetBlockState());
  }, [userJustBlocked, dispatch, navigate]);

  const onOpenDropdown = (): void => {
    setBtnDropdownShow(true);
  };

  const onCloseDropdown = (): void => {
    setBtnDropdownShow(false);
  };

  const onUnsendFriendRequest = (): void => {
    props.onUnsendFriendRequest();
    setBtnDropdownShow(false);
  };

  const onAcceptFriendRequest = (): void => {
    props.onAcceptFriendRequest();
    setBtnDropdownShow(false);
  };

  const onDeclineFriendRequest = (): void => {
    props.onDeclineFriendRequest();
    setBtnDropdownShow(false);
  };

  const onUnfriend = (): void => {
    props.onUnfriend();
    setBtnDropdownShow(false);
  };

  const friendsDropdown = [
    {
      text: "unfriend",
      action: onUnfriend
    }
  ];

  const receivedDropdown = [
    {
      text: "accept request",
      action: onAcceptFriendRequest
    },
    {
      text: "decline request",
      action: onDeclineFriendRequest
    }
  ];

  const sentDropdown = [
    {
      text: "cancel request",
      action: onUnsendFriendRequest
    }
  ];

  const openMessageModal = useCallback((): void => {
    onOpenSendMessageModal(props.user._id, props.user.fullName)
  }, [onOpenSendMessageModal, props.user._id, props.user.fullName]);

  const onPrepareBlockUser = useCallback((): void => {
    setReadyToBlockUser(true);
  }, []);

  const onCancelBlockUser = useCallback((): void => {
    setReadyToBlockUser(false);
  }, []);

  const onBlockUser = useCallback((): void => {
    let relationTransformed: "friends" | "none" | "sentPendingRequests" | "receivedPendingRequests" = "none";
    if(props.friendStatus === "friends") {
      relationTransformed = "friends";
    } else if(props.friendStatus === "receivedFriendRequest") {
      relationTransformed = "receivedPendingRequests";
    } else if (props.friendStatus === "sentFriendRequest") {
      relationTransformed = "sentPendingRequests";
    }
    dispatch(blockUser(props.user._id, relationTransformed));
    setReadyToBlockUser(false);
  }, [dispatch, props.friendStatus, props.user._id]);

  if(authLoading) return <Spinner />;

  return (
    <>
      {(sendMessageErrorMsg !== null || authErrorMsg !== null || readyToBlockUser) && (
        <DefaultModal
          show={sendMessageErrorMsg !== null || readyToBlockUser}
          isErrorModal={sendMessageErrorMsg !== null || authErrorMsg !== null ? true : false}
          title={sendMessageErrorMsg !== null || authErrorMsg !== null ? "Error Occured" : readyToBlockUser ? "Preparing to block user" : ""}
          text={
            sendMessageErrorMsg !== null
            ? sendMessageErrorMsg
            : authErrorMsg !== null
            ? authErrorMsg
            : readyToBlockUser
            ? "Are you sure you want to block this user?"
            : "Unknown error"
          }
          onClose={
            sendMessageErrorMsg !== null
            ? onClearSendMessageError
            : authErrorMsg !== null
            ? () => dispatch(onClearAuthError())
            : readyToBlockUser
            ? onCancelBlockUser
            : () => {return}
          }>
          {
            (sendMessageErrorMsg !== null || authErrorMsg !== null) && (
              <ModalBtn
                btnType="button"
                btnCustomType="btn__ok"
                btnText="OK"
                onClick={sendMessageErrorMsg !== null ? onClearSendMessageError : () => dispatch(onClearAuthError())} />
            )
          }
          {
            readyToBlockUser && (
              <>
                <ModalBtn
                  btnType="button"
                  btnCustomType="btn__cancel"
                  btnText="cancel"
                  onClick={onCancelBlockUser} />
                <ModalBtn
                  btnType="button"
                  btnCustomType="btn__confirm"
                  btnText="block"
                  onClick={onBlockUser} />
              </>
            )
          }
        </DefaultModal>
      )}
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
      <section className={`${styles.header} ${styles.header__users}`}>
        <ProfileHeaderUserInfo user={props.user} />
        {
          props.loading
          ? <Spinner />
          : (
            <div className={styles.header__btns}>
              {
                props.friendStatus === "friends"
                ? (
                  <ProfileHeaderBtn
                    btnType="btn__friends"
                    text="Friends"
                    btnClicked={onOpenDropdown}>
                    <ProfileHeaderBtnDropdown
                      show={btnDropdownShow}
                      className="dropdown__friends"
                      listItems={friendsDropdown}
                      onClose={onCloseDropdown} />
                  </ProfileHeaderBtn>
                )
                : props.friendStatus && props.friendStatus === "receivedFriendRequest"
                ? (
                  <ProfileHeaderBtn
                    btnType="btn__received_friend_request"
                    text="Confirm/Cancel"
                    btnClicked={onOpenDropdown}>
                    <ProfileHeaderBtnDropdown
                      show={btnDropdownShow}
                      className="dropdown__received"
                      listItems={receivedDropdown}
                      onClose={onCloseDropdown} />
                  </ProfileHeaderBtn>
                )
                :  props.friendStatus && props.friendStatus === "sentFriendRequest"
                ? (
                  <ProfileHeaderBtn
                    btnType="btn__sent_friend_request"
                    text="Requested"
                    btnClicked={onOpenDropdown}>
                    <ProfileHeaderBtnDropdown
                      show={btnDropdownShow}
                      className="dropdown__sent"
                      listItems={sentDropdown}
                      onClose={onCloseDropdown} />
                  </ProfileHeaderBtn>
                )
                : props.friendStatus && props.friendStatus === "none" && props.whoCanAddUser && props.whoCanAddUser === "everyone"
                ? (
                  <ProfileHeaderBtn
                    btnType="btn__add_friend"
                    text="Add Friend"
                    btnClicked={props.onSendFriendRequest} />
                )
                : props.friendStatus && props.friendStatus === "none" && props.whoCanAddUser && props.whoCanAddUser === "friendsOfFriends" && props.haveMutualFriends
                ? (
                  <ProfileHeaderBtn
                    btnType="btn__add_friend"
                    text="Add Friend" />
                )
                : null
              }
              {
                ((props.whoCanMessageUser === "everyone" || props.friendStatus === "friends") || (props.whoCanMessageUser === "friendsOfFriends" && props.haveMutualFriends)) && (
                  <ProfileHeaderBtn
                    btnType="btn__message"
                    text="Send Message"
                    btnClicked={openMessageModal} />
                )
              }
              <ProfileHeaderBtn
                btnType="btn__block"
                text="Block User"
                btnClicked={onPrepareBlockUser} />
            </div>
          )
        }
      </section>
    </>
  );
};

export default ProfileHeaderUser;