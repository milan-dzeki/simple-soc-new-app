import { FC } from 'react';
import styles from '../../styles/components/activityLogsPage/singleLog.module.scss';
import { Link } from 'react-router-dom';
import { formatDateToFullTime } from '../../utils/formatDateToFullTime';

interface Props {
  id: string;
  logText: string;
  authUserId: string;
  targetUser: {_id: string; fullName: string} | undefined;
  createdAt: Date;
  postId?: string;
  photoId?: string;
  onPrepateDeleteLog: (logId: string) => void;
}

const SingleLog: FC<Props> = (props) => {
  return (
    <div className={styles.log}>
      <p className={styles.log__text}>
        {props.logText}
      </p>
      <p className={styles.log__date}>
        created: {formatDateToFullTime(props.createdAt)}
      </p>
      <div className={styles.log__btns}>
        <div className={styles.log__btns_left}>
          {
            props.targetUser && props.targetUser._id !== props.authUserId && (
              <Link className={styles.log__btn} to={`/user/${props.targetUser._id}`}>
                view {props.targetUser.fullName}
              </Link>
            )
          }
          {
            props.postId && (
              <Link className={styles.log__btn} to={`/post/${props.postId}`}>
                view post
              </Link>
            )
          }
        </div>
        <button className={styles.log__delete} onClick={() => props.onPrepateDeleteLog(props.id)}>
          delete log
        </button>
      </div>
    </div>
  );
};

export default SingleLog;