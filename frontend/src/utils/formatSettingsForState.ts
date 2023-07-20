import { ISettingsPageState, ISettingsResponseData } from "../types/settingsPage/settingsTypes";

export const formatSettingsForState = (data: ISettingsResponseData) => {
  // let state = {
  //   profileAccess: {
  //     title: "Profile Access",
  //     settings: {}
  //   },
  //   messaging: {
  //     title: "Messaging",
  //     settings: {}
  //   },
  //   commentingAndLiking: {
  //     title: "Commenting and Liking",
  //     settings: {}
  //   },
  //   friendRequests: {
  //     title: "Friend Requests",
  //     settings: {}
  //   }
  // } as ISettingsPageState;

  // for(const key in data.settings) {
  //   if(key.toLowerCase().includes("see")) {
  //     state.profileAccess.settings[key as keyof typeof state.profileAccess.settings] = {
  //       everyone: "Everyone",
  //       friends: "Friends",
  //       friendsOfFriends: "Friends of friends",
  //       none: "No one"
  //     };
  //   // } else if(key.toLowerCase().includes("see"))
  // })

  // return state;
};