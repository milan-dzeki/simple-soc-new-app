import { FC, memo } from 'react';
import styles from '../../styles/components/friends/searchFriend.module.scss';
import { ISearchUser } from '../../types/searchPage/types';
import noUserImg from '../../images/no-user.jpg';
import { Link } from 'react-router-dom';

interface Props {
  user: ISearchUser;
  friendsLoading: boolean;
  openFriendsModal: (mutuals: string[], clickedFriendName: string) => void;
  onOpenSendMessageModal: (userId: string, userName: string) => void;
  onSendFriendRequest: (userId: string) => void;
}

const SearchFriend: FC<Props> = (props) => {
  return (
    <div className={styles.user}>
      <div className={styles.user__top}>
        <div className={styles.user__photo}>
          <div className={styles.user__photo_img}>
            <img src={props.user.user.profilePhotoUrl || noUserImg} alt="user" />
          </div>
        </div>
        <div className={styles.user__info}>
          <p className={styles.user__name}>
            {props.user.user.fullName}
          </p>
          {
            props.user.friendStatus === "friends" && (
              <p className={styles.user__friends}>
                your friend
              </p>
          )}
          {
            props.user.mutualFriends.length > 0 && (
              <p className={styles.user__mutuals} onClick={() => props.openFriendsModal(props.user.mutualFriends, props.user.user.fullName)}>
                {props.user.mutualFriends.length} mutual friends
              </p>
            )
          }
        </div>
      </div>
      <div className={styles.user__btns}>
        <Link to={`/user/${props.user.user._id}`} className={`${styles.user__btn} ${styles.user__btn_view}`}>
          view
        </Link>
        {
          ((props.user.friendStatus === "none" && props.user.settings.whoCanAddMe === "everyone")
          || (props.user.friendStatus === "none" && props.user.settings.whoCanAddMe === "friendsOfFriends" && props.user.mutualFriends.length > 0))
          && (
            <button
              type="button"
              className={`${styles.user__btn} ${styles.user__btn_add}`}
              disabled={props.friendsLoading}
              onClick={() => props.onSendFriendRequest(props.user.user._id)}>
              add friend
            </button>
          )
        }
        {
          (props.user.settings.whoCanMessageMe === "everyone"
          || (props.user.settings.whoCanMessageMe === "friends" && props.user.friendStatus === "friends")
          || (props.user.settings.whoCanMessageMe === "friendsOfFriends" && props.user.mutualFriends.length > 0))
          && (
            <button
              type="button"
              className={`${styles.user__btn} ${styles.user__btn_msg}`}
              onClick={() => props.onOpenSendMessageModal(props.user.user._id, props.user.user.fullName)}>
              send message
            </button>
          )
        }
      </div>
    </div>
  );
};

export default memo(SearchFriend);