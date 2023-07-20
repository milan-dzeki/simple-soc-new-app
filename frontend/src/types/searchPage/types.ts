export interface ISearchUser {
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  friendStatus: "none" | "friends" | "requestSent" | "requestReceived";
  mutualFriends: string[];
  settings: {
    whoCanAddMe: "friendsOfFriends" | "none" | "everyone";
    whoCanMessageMe: "everyone" | "friends" | "friendsOfFriends";
  };
}