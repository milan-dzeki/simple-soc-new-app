import { ISettingName } from "../../types/settingsPage/settingsTypes";

export const formatSettingName = (name: ISettingName | string): string => {
  if(name === "whoCanAddMe") return "Who can add send me friend request";
  if(name === "whoCanMessageMe") return "Who can message me";
  if(name === "whoCanCommentMyPhotos") return "Who can comment my photos";
  if(name === "whoCanCommentMyPosts") return "Who can comment my posts";
  if(name === "whoCanLikeMyPhotos") return "Who can like my photos";
  if(name === "whoCanLikeMyPosts") return "Who can like my posts";
  if(name === "whoCanSeeMyFriendsList") return "Who can see my friend list";
  if(name === "whoCanSeeMyPhotos") return "Who can see my photos";
  if(name === "whoCanSeeMyPosts") return "Who can see my posts";
  if(name === "whoCanSeeMyProfileInfo") return "Who can see my profile info";
  return name;
};