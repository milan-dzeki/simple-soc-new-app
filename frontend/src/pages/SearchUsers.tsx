import { ChangeEvent, FC, FormEvent, useState, useCallback, useEffect } from 'react';
import styles from '../styles/pages/searchPage.module.scss';
// types
import { useDispatch } from 'react-redux';
import { ISearchUser } from '../types/searchPage/types';
import { useTypedSelector } from '../hooks/useTypedSelector';
// hooks
import { useMutualFriends } from '../hooks/useMutualFriendsHook/useMutualFriends';
import { useSendMessage } from '../hooks/useSendMessageHook/useSendMessage';
// components
import PageContainer from '../components/Shared/PageContainer';
import SearchField from '../components/Inputs/SearchField';
import axiosUser from '../axios/axiosUser';
import SearchButtons from '../components/SearchPage/SearchButtons';
import SearchFriend from '../components/Friends/SearchFriend';
import Spinner from '../components/Shared/Spinner';
import FriendsAndUsersModal from '../components/Modals/FriendsAndUsersModal';
import SendMessageModal from '../components/ChatsAndMessages/SendMessageModal';
import DefaultModal from '../components/Modals/DefaultModal';
import ModalBtn from '../components/Buttons/ModalBtn';
// redux
import { sendFriendRequest, clearFriendsError, resetRequestStatus } from '../store/actions/friendsActions';

const SearchUsers: FC = () => {
  const dispatch = useDispatch();
  const { friendsLoading, friendsErrorMsg, friends, requestStatus } = useTypedSelector(state => state.friends);
  const [searchText, setSearchText] = useState("");
  const [resultsFor, setResultsFor] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersErrorMsg, setUsersErrorMsg] = useState<string | null>(null);
  const [users, setUsers] = useState<{
    search: ISearchUser[];
    know: ISearchUser[];
    newest: ISearchUser[];
  }>({
    search: [],
    know: [],
    newest: []
  });
  const [activeBtn, setActiveBtn] = useState<"newest" | "know" | "search">("newest");

  const [userRequestedId, setUserRequestedId] = useState<string | null>(null);

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

  const onSearchChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    setSearchText(target.value);
  };

  const onClearSearchText = (): void => {
    setSearchText("");
  };

  const onSearchUsers = useCallback(async(event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setUsersLoading(true);
    const token = localStorage.getItem("socNetAppToken");
    
    try {
      const { data } = await axiosUser.get(`/searchByName/${searchText}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(prev => {
        return {
          ...prev,
          search: data.users
        };
      });
      console.log(data);
      setResultsFor(searchText);
      setSearchText("");
      setActiveBtn("search");
    } catch(error) {
      console.log(error);
      setUsersErrorMsg((error as any).response.data.message);
    }

    setUsersLoading(false);
  }, [searchText]);

  const onGetPeopleYouMayKnow = useCallback(async(): Promise<void> => {
    // const friend
  }, []);

  const onGetUsersByUrl = async(url: string, activeBtn: "newest" | "know"): Promise<void> => {
    setUsersLoading(true);
    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosUser.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(data);
      setUsers(prev => {
        return {
          ...prev,
          [activeBtn]: data.users,
          search: []
        };
      });
      setActiveBtn(activeBtn);
      setResultsFor("");
      setSearchText("");
    } catch(error) {
      console.log(error);
      setUsersErrorMsg((error as any).response.data.message);
    }
    setUsersLoading(false)
  };

  useEffect(() => {
    onGetUsersByUrl("/lastJoined", "newest");
  }, []);

  useEffect(() => {
    if(requestStatus === "requested" && userRequestedId !== null) {
      setUsers(prev => {
        const targetUserIndex = prev[activeBtn].findIndex(user => user.user._id === userRequestedId);
        if(targetUserIndex === -1) return prev;
        const copiedList = [...prev[activeBtn]];
        const updatedFriend = {...copiedList[targetUserIndex]};
        updatedFriend.friendStatus = "requestSent";
        copiedList[targetUserIndex] = updatedFriend;

        return {
          ...prev,
          [activeBtn]: copiedList
        };
      });

      setUserRequestedId(null);
      dispatch(resetRequestStatus());
    } else {
      return;
    }
  }, [activeBtn, dispatch, requestStatus, userRequestedId]);

  const onSelectSearchResults = useCallback((): void => {
    setActiveBtn("search");
  }, []);

  const openFriendsModal = useCallback((mutuals: string[], clickedFriendName: string): void => {
    const displayedFriends = friends.filter(friend => mutuals.includes(friend.user._id));

    onOpenFriendsModal(mutuals, clickedFriendName, displayedFriends);
  }, [friends, onOpenFriendsModal]);

  const onSendFriendRequest = useCallback((userId: string): void => {
    dispatch(sendFriendRequest(userId));
    setUserRequestedId(userId);
  }, [dispatch]);

  if(usersLoading || sendMessageLoading) return <Spinner />;

  return (
    <>
      {mutualFriendsInfo.modalShow && mutualFriendsInfo.clickedFriendName && (
        <FriendsAndUsersModal
          show={mutualFriendsInfo.modalShow}
          title={`Mutual Friends with ${mutualFriendsInfo.clickedFriendName}`}
          friends={mutualFriendsInfo.mutualFriends}
          onClose={onCloseFriendsModal} />
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
      <PageContainer
        display="container__block"
        hasPageTitle={true}
        titleTextAlign="title__left"
        titleText="Search people"
        width="big"
        loading={false}>
        <SearchField
          searchText={searchText}
          resultsFor={resultsFor}
          onSearchChanged={onSearchChanged}
          onClearSearch={onClearSearchText}
          onSearch={onSearchUsers} />
        <SearchButtons
          activeBtn={activeBtn}
          searched={resultsFor.trim().length > 0}
          onGetUsersByUrl={onGetUsersByUrl}
          onSelectSearchResults={onSelectSearchResults} />
        <PageContainer
          display="container__flex"
          hasPageTitle={false}
          loading={false}
          width="big">
          {
            users[activeBtn].length === 0 && searchText.trim().length === 0
            ? <p className={styles.no_results}>No results found</p>
            : users[activeBtn].map(user => {
              return (
                <SearchFriend
                  key={user.user._id}
                  user={user}
                  friendsLoading={friendsLoading}
                  openFriendsModal={openFriendsModal}
                  onOpenSendMessageModal={onOpenSendMessageModal}
                  onSendFriendRequest={onSendFriendRequest} />
              );
            })
          }
        </PageContainer>
      </PageContainer>
    </>
  );
};

export default SearchUsers;