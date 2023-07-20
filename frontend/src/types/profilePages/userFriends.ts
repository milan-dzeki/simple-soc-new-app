export interface IUserFriend {
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  mutualFriends: string[];
  whoCanMessageUser: "everyone" | "friends" | "friendsOfFriends";
  whoCanAddUser: "everyone" | "friendsOfFriends" | "none";
}