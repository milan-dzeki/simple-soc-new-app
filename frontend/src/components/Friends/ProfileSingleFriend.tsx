import { FC, memo } from 'react';
import styles from '../../styles/components/friends/profileSingleFriend.module.scss';
import { Link } from 'react-router-dom';
import noImg from '../../images/no-user.jpg';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';

interface Props {
  userRelation: "friends" | "sentPendingRequests" | "receivedPendingRequests" | "none";
  user: {
    _id: string;
    fullName: string;
    profilePhotoUrl: string;
  };
  mutualFriends: string[];
  whoCanMessageUser?: "everyone" | "friends" | "friendsOfFriends";
  whoCanAddMe?: "everyone" | "none" | "friendsOfFriends";
  isAuthUserList?: boolean;
  onOpenFriendsModal?: (mutualFriends: string[], friendName: string) => void;
  onPrepareFriendOrUserAction?: (id: string, name: string, action: "unfriend" | "declineRequest" | "unsendRequest" | "acceptRequest" | "block", relationToUser: "friends" | "sentPendingRequests" | "receivedPendingRequests" | "none") => void;
  onOpenSendMessageModal: (userId: string, userName: string) => void
}

const ProfileSingleFriend: FC<Props> = (props) => {
  const { authUser } = useTypedSelector(state => state.auth);

  return (
    <div className={styles.friend}>
      <div className={styles.friend__info}>
        <div className={styles.friend__img}>
          <img src={props.user.profilePhotoUrl || noImg} alt="user" />
        </div>
        <div className={styles.friend__info_right}>
          <p className={styles.friend__name}>{props.user.fullName} {props.user._id === authUser!._id && "(you)"}</p>
          {
            props.mutualFriends.length > 0 && props.user._id !== authUser!._id && (
              <button
                type="button"
                className={styles.friend__mutuals}
                onClick={() => props.onOpenFriendsModal!(props.mutualFriends, props.user.fullName)}>
                {props.mutualFriends.length} mutual friends
              </button>
            )
          }
          {
            !props.isAuthUserList && props.user._id !== authUser!._id && props.userRelation === "friends" && (
              <p className={styles.friend__yours}>your friend</p>
            )
          }
        </div>
      </div>
      <div className={styles.friend__btns}>
        {
          props.user._id !== authUser!._id && (
            <Link
              to={`/user/${props.user._id}`}
              className={`${styles.friend__btn} ${styles.friend__btn_view}`}>
              view
            </Link>
          )
        }
        {
          (props.userRelation === "friends" || (props.whoCanMessageUser && props.whoCanMessageUser === "everyone") || (props.whoCanMessageUser && props.whoCanMessageUser === "friendsOfFriends" && props.mutualFriends.length > 0)) && props.user._id !== authUser!._id && (
            <button
              type="button"
              className={`${styles.friend__btn} ${styles.friend__btn_msg}`}
              onClick={() => props.onOpenSendMessageModal(props.user._id, props.user.fullName)}>
              send message
            </button>
          )
        }
        {
          props.userRelation === "friends" && props.user._id !== authUser!._id && props.isAuthUserList
          ? (
            <button
              type="button"
              className={`${styles.friend__btn}`}
              onClick={() => props.onPrepareFriendOrUserAction!(props.user._id, props.user.fullName, "unfriend", props.userRelation)}>
              unfriend
            </button>
          )
          : props.userRelation === "receivedPendingRequests" && props.user._id !== authUser!._id && props.isAuthUserList
          ? (
            <>
              <button
                type="button"
                className={`${styles.friend__btn}`}
                onClick={() => props.onPrepareFriendOrUserAction!(props.user._id, props.user.fullName, "acceptRequest", props.userRelation)}>
                accept request
              </button>
              <button
                type="button"
                className={`${styles.friend__btn}`}
                onClick={() => props.onPrepareFriendOrUserAction!(props.user._id, props.user.fullName, "declineRequest", props.userRelation)}>
                decline request
              </button>
            </>
          )
          : props.userRelation === "sentPendingRequests" && props.user._id !== authUser!._id && props.isAuthUserList
          ? (
            <button
              type="button"
              className={`${styles.friend__btn}`}
              onClick={() => props.onPrepareFriendOrUserAction!(props.user._id, props.user.fullName, "unsendRequest", props.userRelation)}>
              cancel request
            </button>
          )
          : null
        }
        {
          props.user._id !== authUser!._id && props.isAuthUserList && (
            <button
              type="button"
              className={`${styles.friend__btn} ${styles.friend__btn_block}`}
              onClick={() => props.onPrepareFriendOrUserAction!(props.user._id, props.user.fullName, "block", props.userRelation)}>
              block
            </button>
          )
        }
      </div>
    </div>
  );
};

export default memo(ProfileSingleFriend);