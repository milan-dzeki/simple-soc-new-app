interface IMutualFriend {
  _id: string; 
  fullName: string; 
  profilePhotoUrl: string
}

export interface IUseMutualFriendsState {
  modalShow: boolean;
  clickedFriendName: string | null;
  mutualFriends: IMutualFriend[];
}

