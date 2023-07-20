export interface ISettingsResponseData {
  status: string;
  settings: {
    [group: string]: {
      [name: string]: "everyone" | "friends" | "friendsOfFriends" | "none";
    };
  };
}

export type ISettingValue = "everyone" | "friends" | "friendsOfFriends" | "none";
export interface ISettingOption {
  dbValue: "everyone" | "friends" | "friendsOfFriends" | "none"; 
  usedValue: "Everyone" | "Friends only" | "Friends of friends" | "No one";
}
export interface ISettingsBox {
  [name: string]: {
    currentValue: ICurrentOptionValue;
    optionsShow: boolean;
    options: ISettingOption[];
  };
}


export type ISettingName = (
  "whoCanAddMe" | "whoCanMessageMe" | "whoCanSeeMyProfileInfo" | "whoCanSeeMyPosts" | "whoCanSeeMyPhotos" | "whoCanSeeMyFriendsList" | "whoCanCommentMyPhotos" | "whoCanCommentMyPosts" | "whoCanLikeMyPhotos" | "whoCanLikeMyPosts"
);

export type ICurrentOptionValue = "Everyone" | "Friends only" | "Friends of friends" | "No one";

export interface ISettingsPageState {
  [settingGroup: string]: ISettingsBox;
}