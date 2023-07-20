import { FC, lazy, useCallback, useState } from 'react';
import styles from '../../styles/components/homePage/homePageContainer.module.scss';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useSendMessage } from '../../hooks/useSendMessageHook/useSendMessage';
// components
import ActiveFriend from '../Friends/ActiveFriend';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import Spinner from '../Shared/Spinner';
import Backdrop from '../Shared/Backdrop';
const SendMessageModal = lazy(() => import('../ChatsAndMessages/SendMessageModal'));

interface Props {
  children: React.ReactNode;
}

const HomePageContainer: FC<Props> = (props) => {
  const activeUsers = useTypedSelector(state => state.activeUsers);
  const { friendsLoading, friends } = useTypedSelector(state => state.friends);

  const [activeFriendsShow, setActiveFriendsShow] = useState(false);

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

  const onGetActiveFriends = useCallback((): {_id: string; fullName: string; profilePhotoUrl: string}[] => {
    const activeUsersIds = activeUsers.map(user => user.userId);

    const activeFriends = friends.filter(friend => activeUsersIds.includes(friend.user._id)).map(friend => ({_id: friend.user._id, fullName: friend.user.fullName, profilePhotoUrl: friend.user.profilePhotoUrl}));
    
    return activeFriends;
  }, [activeUsers, friends]);

  const onShowActiveFriends = (): void => {
    setActiveFriendsShow(true);
  };

  const onHideActiveFriends = useCallback((): void => {
    setActiveFriendsShow(false);
  }, []);

  return (
    <>
      {activeFriendsShow && (
        <Backdrop
          show={activeFriendsShow}
          onClose={onHideActiveFriends}
          bcgColor="dark"
          isActiveFriendsBackdrop={true} />
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
      <main className={styles.container}>
        <button
          type="button"
          className={styles.container__active_fr}
          onClick={onShowActiveFriends}>
          see active friends
        </button>
        <section className={styles.container__posts}>
          <article className={styles.container__posts_list}>
            {props.children}
          </article>
        </section>
        <section className={`${styles.container__users} ${activeFriendsShow ? styles.container__users_show : ""}`}>
          <h4 className={styles.container__users_title}>
            Active Friends
          </h4>
          <button
            type="button"
            className={styles.container__users_close}
            onClick={onHideActiveFriends}>
            close list
          </button>
          <article className={styles.container__users_list}>
            <div className={styles.container__users_list_content}>
              {
                friendsLoading
                ? <Spinner />
                : !friendsLoading && activeUsers.length <= 1
                ? <p className={styles.container__users_list_empty}>No active friends</p>
                : onGetActiveFriends().map(friend => {
                  return (
                    <ActiveFriend
                      key={friend._id}
                      id={friend._id}
                      fullName={friend.fullName}
                      profilePhotoUrl={friend.profilePhotoUrl}
                      onPrepareSendMessage={onOpenSendMessageModal} />
                  );
                })
              }
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default HomePageContainer;