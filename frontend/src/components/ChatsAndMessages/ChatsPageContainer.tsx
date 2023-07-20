import { FC } from 'react';
import styles from '../../styles/components/chatsAndMessages/chatsPageContainer.module.scss';

interface Props {
  children: React.ReactNode;
}

const ChatsPageContainer: FC<Props> = (props) => {
  return (
    <main className={styles.container}>{props.children}</main>
  );
};

export default ChatsPageContainer;