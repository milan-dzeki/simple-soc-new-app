import { FC, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/notifications/singleNotifications.module.scss';
import noUserImg from '../../images/no-user.jpg';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { INotification } from '../../store/types/notificationsTypes';
import { formatDateToFullTime } from '../../utils/formatDateToFullTime';
import { markNotificationAsRead, markNotificationAsUnread, deleteNotification } from '../../store/actions/notificationsActions';
import { acceptFriendRequest, declineFriendRequest, resetRequestStatus } from '../../store/actions/friendsActions';
import { IFriend } from '../../store/types/friendsTypes';

interface Props {
  notification: INotification;
}

const SingleNotification: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { friends, receivedPendingRequests, requestStatus } = useTypedSelector(state => state.friends);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [notifToDeleteId, setNotifToDeleteId] = useState<string | null>(null);

  const [notificationFriendRequestStatus, setNotificationFriendRequestStatus] = useState<"accepted" | "declined" | null>(null);

  useEffect(() => {
    if(requestStatus === "accepted") {
      setNotificationFriendRequestStatus("accepted");
    } else if(requestStatus === "declined") {
      setNotificationFriendRequestStatus("declined");
    } else {
      return;
    }
    dispatch(resetRequestStatus());
  }, [requestStatus, dispatch])

  const formatPostNotifText = (text: string, postId: string): React.ReactNode => {
    const textSplit = text.split(" ");
    let textSplitPoped = text.split(" ");
    textSplitPoped.pop();

    return (
      <span className={styles.notif__text_txt}>
        {textSplitPoped.join(" ")} <Link to={`/post/${postId}`} className={styles.notif__text_txt_sublink}>{textSplit[textSplit.length - 1]}</Link>
      </span>
    );
  };

  const formatPhotoNotifText = (text: string, albumId: string, photoId: string): React.ReactNode => {
    const textSplit = text.split(" ");
    let textSplitPoped = text.split(" ");
    textSplitPoped.pop();

    return (
      <span className={styles.notif__text_txt}>
        {textSplitPoped.join(" ")} <Link to={`/photo/${albumId}/${photoId}`} className={styles.notif__text_txt_sublink}>{textSplit[textSplit.length - 1]}</Link>
      </span>
    );
  }; 

  const formatLikeAndCommentPostNotifText = (text: string, postId: string, commentId: string): React.ReactNode => {
    const textSplit = text.split(" ");
    let textSplitPoped = text.split(" ");
    textSplitPoped.pop();

    return (
      <span className={styles.notif__text_txt}>
        {textSplitPoped.join(" ")} <Link to={`/post/${postId}`} state={{commentId}} className={styles.notif__text_txt_sublink}>{textSplit[textSplit.length - 1]}</Link>
      </span>
    );
  };

  const formatLikeAndCommentPhotoNotifText = (text: string, userId: string, albumId: string, photoId: string, commentId: string): React.ReactNode => {
    const textSplit = text.split(" ");
    let textSplitPoped = text.split(" ");
    textSplitPoped.pop();

    return (
      <span className={styles.notif__text_txt}>
        {textSplitPoped.join(" ")} <Link to={`/photo/${albumId}/${photoId}`} state={{commentId}} className={styles.notif__text_txt_sublink}>{textSplit[textSplit.length - 1]}</Link>
      </span>
    );
  }; 

  const hasUserBecameFriend = (): boolean => {
    const user = friends.find(u => u.user._id === props.notification.fromUser._id);
    if(user) return true;
    return false;
  };

  const isUsernNotInPendingList = (): boolean => {
    const user = receivedPendingRequests.find(u => u.user._id === props.notification.fromUser._id);
    if(user) return true;
    return false;
  };

  const getRequestedUser = (): IFriend | undefined => {
    const user = receivedPendingRequests.find(u => u.user._id === props.notification.fromUser._id);
    if(user) {
      return user;
    } else {
      setNotificationError("Invalid friend request. Maybe user has withdrawned");
    }
  };

  const onMarkNotifAsRead = (notifId: string): void => {
    dispatch(markNotificationAsRead(notifId));
  };

  const onMarkNotifAsUnread = (notifId: string): void => {
    dispatch(markNotificationAsUnread(notifId));
  };

  const onDeleteNotification = (): void => {
    dispatch(deleteNotification(props.notification._id, props.notification.status));
    setNotifToDeleteId(null);
  };

  return (
    <div className={`${styles.notif} ${props.notification.status === "unread" ? styles.notif__unread : ""}`}>
      <div className={styles.notif__btns}>
        {
          notifToDeleteId
          ? (
            <>
              <p className={styles.notif__del_text}>
                Are you sure you want to delete this notification?
              </p>
              <button
                type="button"
                className={`${styles.notif__btn} ${styles.notif__btn_cancel}`}
                onClick={() => setNotifToDeleteId(null)}>
                cancel
              </button>
              <button
                type="button"
                className={`${styles.notif__btn} ${styles.notif__btn_delete}`}
                onClick={onDeleteNotification}>
                yes, delete
              </button>
            </>
          )
          : (
            <>
              <button
                type="button"
                className={`${styles.notif__btn} ${styles.notif__btn_mark}`}
                onClick={
                  props.notification.status === "read"
                  ? () => onMarkNotifAsUnread(props.notification._id)
                  : () => onMarkNotifAsRead(props.notification._id)
                }>
                {props.notification.status === "unread" ? "Mark as read" : "Mark as unread"}
              </button>
              <button
                type="button"
                className={`${styles.notif__btn} ${styles.notif__btn_delete}`}
                onClick={() => setNotifToDeleteId(props.notification._id)}>
                delete
              </button>
            </>
          )
        }
      </div>
      <div className={styles.notif__content}>
        <div className={styles.notif__image}>
          <img src={props.notification.fromUser.profilePhotoUrl || noUserImg} alt="user" />
        </div>
        <div className={styles.notif__text}>
          {
            (props.notification.notificationType === "acceptedFriendRequest" || props.notification.notificationType === "receivedFriendRequest")
            ? (
              <>
                <Link className={styles.notif__text_link} to={`/user/${props.notification.fromUser._id}`}>{props.notification.fromUser.fullName}</Link> 
                <span className={styles.notif__text_txt}>{props.notification.text}</span>
              </>
            )
            : props.notification.notificationType === "userLikedYourPhoto" || props.notification.notificationType === "userTaggedYouInPhoto"
            ? (
              <>
                <Link className={styles.notif__text_link} state={{albumId: props.notification.albumId, photoId: props.notification.photoId}} to={`/user/${props.notification.fromUser._id}`}>{props.notification.fromUser.fullName}</Link> 
                {formatPhotoNotifText(props.notification.text, props.notification.albumId!, props.notification.photoId!)}
              </>
            )
            : props.notification.notificationType === "userLikedYourPost" || props.notification.notificationType === "userTaggedYouInPost"
            ? (
              <>
                <Link className={styles.notif__text_link} to={`/user/${props.notification.fromUser._id}`}>{props.notification.fromUser.fullName}</Link> 
                {formatPostNotifText(props.notification.text, props.notification.postId!)}
              </>
            )
            : props.notification.notificationType === "userLikedYourCommentOnPost" || props.notification.notificationType === "userCommentedOnYourPost" || props.notification.notificationType === "userTaggedYouInCommentOnPost"
            ? (
              <>
                <Link className={styles.notif__text_link} to={`/user/${props.notification.fromUser._id}`}>{props.notification.fromUser.fullName}</Link> 
                {formatLikeAndCommentPostNotifText(props.notification.text, props.notification.postId!, props.notification.commentId!)}
              </>
            )
            : props.notification.notificationType === "userCommentedOnYourPhoto" || props.notification.notificationType === "userLikedYourCommentOnPhoto" || props.notification.notificationType === "userTaggedYouInCommentOnPhoto"
            ? (
              <>
                <Link className={styles.notif__text_link} to={`/user/${props.notification.fromUser._id}`}>{props.notification.fromUser.fullName}</Link>
                {formatLikeAndCommentPhotoNotifText(props.notification.text, props.notification.fromUser._id, props.notification.albumId!, props.notification.photoId!, props.notification.commentId!)}
              </>
            )
            : null
          }
        </div>
        <div className={styles.notif__time}>
          {formatDateToFullTime(props.notification.createdAt)}
        </div>
      </div>
      {
        props.notification.notificationType === "receivedFriendRequest" && !hasUserBecameFriend() && isUsernNotInPendingList() 
        ? (
          <div className={styles.notif__actions}>
            <button
              type="button"
              className={`${styles.notif__act} ${styles.notif__act_accept}`}
              onClick={() => {
                const user = getRequestedUser();
                if(user) {
                  dispatch(acceptFriendRequest(user.user._id));
                }
              }}>
              accept
            </button>
            <button
              type="button"
              className={`${styles.notif__act} ${styles.notif__act_decline}`}
              onClick={() => dispatch(declineFriendRequest(props.notification.fromUser._id))}>
              decline
            </button>
          </div>
        )
        : props.notification.notificationType === "receivedFriendRequest" && ((hasUserBecameFriend() && !isUsernNotInPendingList()) || notificationFriendRequestStatus === "accepted")
        ? <div className={styles.notif__actions_result}>request accepted</div>
        : props.notification.notificationType === "receivedFriendRequest" && ((!hasUserBecameFriend() && !isUsernNotInPendingList()) || notificationFriendRequestStatus === "declined")
        ? <div className={styles.notif__actions_result}>request declined</div>
        : null
      }
    </div>
  );
};

export default SingleNotification;