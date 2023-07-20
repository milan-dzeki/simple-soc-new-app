export const formaSettingsTitles = (title: "profileAccess" | "messaging" | "commentingAndLiking" | "friendRequests" | string): string => {
  if(title === "profileAccess") return "Profile Access";
  if(title === "messaging") return "Messaging";
  if(title === "commentingAndLiking") return "Commenting and Liking";
  if(title === 'friendRequests') return "Friend Requests";
  return title;
};