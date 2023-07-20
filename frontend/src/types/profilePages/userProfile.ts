import { IPost } from "../shared/post";

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  profilePhotoUrl: string;
  dateOfBirth: string;
  gender: "male" | "female" | "unset";
  createdAt: Date;
}

export interface IUserSettings {
  commentingAndLiking: {
    whoCanCommentMyPhotos: "everyone" | "friends" | "friendsOfFriends" | "none";
    whoCanCommentMyPosts: "everyone" | "friends" | "friendsOfFriends" | "none";
    whoCanLikeMyPhotos: "everyone" | "friends" | "friendsOfFriends" | "none";
    whoCanLikeMyPosts: "everyone" | "friends" | "friendsOfFriends" | "none";
  };
  friendRequests: {
    whoCanAddMe: "everyone" | "friendsOfFriends" | "none";
  };
  messaging: {
    whoCanMessageMe: "everyone" | "friends" | "friendsOfFriends";
  };
  profileAccess: {
    whoCanSeeMyFriendsList: "everyone" | "friends" | "friendsOfFriends" | "none";
    whoCanSeeMyPhotos: "everyone" | "friends" | "friendsOfFriends" | "none";
    whoCanSeeMyPosts: "everyone" | "friends" | "friendsOfFriends" | "none";
    whoCanSeeMyProfileInfo: "everyone" | "friends" | "friendsOfFriends" | "none";
  };
}

export interface IUserPost {}

export interface IUserPageResponseData {
  status: string;
  user: IUser | null;
  userSettings: IUserSettings | null;
  posts: IPost[];
  friendStatus: "friends" | "none" | "sentFriendRequest" | "receivedFriendRequest";
  haveMutualFriends: boolean;
}

// export interface IUserPageState {
//   user: IUser | null;
//   posts: IPost[];
//   settings: IUserSettings | null;
//   friendStatus: "friends" | "none" | "sentFriendRequest" | "receivedFriendRequest";
//   haveMutualFriends: boolean;
// }
export interface IUserPageState {
  user: IUser | null;
  settings: IUserSettings | null;
  friendStatus: "friends" | "none" | "sentFriendRequest" | "receivedFriendRequest";
  haveMutualFriends: boolean;
}