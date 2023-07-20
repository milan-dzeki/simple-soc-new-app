import { ISettingsPageState } from "../../types/settingsPage/settingsTypes";

export const settingsOptions: ISettingsPageState = {
  commentingAndLiking: {
    whoCanCommentMyPhotos: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    },
    whoCanCommentMyPosts: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    },
    whoCanLikeMyPhotos: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    },
    whoCanLikeMyPosts: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    }
  },
  friendRequests: {
    whoCanAddMe: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    }
  },
  messaging: {
    whoCanMessageMe: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        }
      ]
    }
  },
  profileAccess: {
    whoCanSeeMyFriendsList: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    },
    whoCanSeeMyPhotos: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    },
    whoCanSeeMyPosts: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    },
    whoCanSeeMyProfileInfo: {
      currentValue: "Everyone",
      optionsShow: false,
      options: [
        {
          dbValue: "everyone",
          usedValue: "Everyone"
        },
        {
          dbValue: "friendsOfFriends",
          usedValue: "Friends of friends"
        },
        {
          dbValue: "friends",
          usedValue: "Friends only"
        },
        {
          dbValue: "none",
          usedValue: "No one"
        }
      ]
    }
  }
};