import { ICurrentOptionValue, ISettingValue } from "../../types/settingsPage/settingsTypes";

export const formatSettingOptionToDB = (value: ISettingValue): ICurrentOptionValue => {
  if(value === "everyone") return "Everyone";
  if(value === "none") return "No one";
  if(value === "friends") return "Friends only";
  if(value === "friendsOfFriends") return "Friends of friends";
  return value;
};