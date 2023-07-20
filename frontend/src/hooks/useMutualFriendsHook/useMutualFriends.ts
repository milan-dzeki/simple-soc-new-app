import { useState, useCallback } from "react";
import { IUseMutualFriendsState } from "./useMutualFriendsTypes";
import { IFriend } from "../../store/types/friendsTypes";

const initState: IUseMutualFriendsState = {
  modalShow: false,
  clickedFriendName: null,
  mutualFriends: []
};

export const useMutualFriends = (): {
  mutualFriendsInfo: IUseMutualFriendsState;
  onOpenFriendsModal: (mutuals: string[], clickedFriendName: string, friends: IFriend[]) => void;
  onCloseFriendsModal: () => void;
} => {
  const [state, setState] = useState<IUseMutualFriendsState>(initState);

  const onOpenFriendsModal = useCallback((mutuals: string[], clickedFriendName: string, friends: IFriend[]): void => {
    const displayedFriends = friends.filter(friend => mutuals.includes(friend.user._id));

    setState({
      modalShow: true,
      clickedFriendName,
      mutualFriends: displayedFriends.map(user => ({_id: user.user._id, fullName: user.user.fullName, profilePhotoUrl: user.user.profilePhotoUrl}))
    });
  }, []);

  const onCloseFriendsModal = useCallback((): void => {
    setState(initState);
  }, []);

  return {
    mutualFriendsInfo: state,
    onOpenFriendsModal,
    onCloseFriendsModal
  };
};