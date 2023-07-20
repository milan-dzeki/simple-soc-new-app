import { FC, memo } from 'react';
import styles from '../../styles/components/posts/createPostInput.module.scss';

interface Props {
  onClick: () => void;
  homePagePosts?: boolean;
}

const CreatePostInput: FC<Props> = (props) => {
  return (
    <div className={`${styles.post} ${props.homePagePosts ? styles.post__home : ""}`}>
      <div className={styles.post__title}>
        Create New Post
      </div>
      <div className={styles.post__body}>
        <div className={styles.post__input} onClick={props.onClick}>
          Write / Upload something...
        </div>
      </div>
    </div>
  );
};

export default memo(CreatePostInput);