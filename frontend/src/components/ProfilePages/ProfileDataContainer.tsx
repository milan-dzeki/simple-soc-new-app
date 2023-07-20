import { FC } from 'react';
import styles from '../../styles/components/profilePages/profileDataContainer.module.scss';
import Spinner from '../Shared/Spinner';

interface Props {
  loading: boolean;
  activeLink: "posts" | "info" | "photos" | "friends";
  onChangeActiveLink: (link: "posts" | "info" | "photos" | "friends") => void;
  onGetUserProfile: () => Promise<void>;
  children: React.ReactNode;
}

const ProfileDataContainer: FC<Props> = (props) => {
  return (
    <main className={styles.container}>
      <section className={styles.container__links}>
        <button
          type="button"
          className={`${styles.container__link} ${props.activeLink === "posts" ? styles.container__link_active : ""}`}
          disabled={props.loading}
          onClick={() => props.onChangeActiveLink("posts")}>
          Posts
        </button>
        <button
          type="button"
          className={`${styles.container__link} ${props.activeLink === "info" ? styles.container__link_active : ""}`}
          disabled={props.loading}
          onClick={() => props.onChangeActiveLink("info")}>
          Profile Info
        </button>
        <button
          type="button"
          className={`${styles.container__link} ${props.activeLink === "photos" ? styles.container__link_active : ""}`}
          disabled={props.loading}
          onClick={() => props.onChangeActiveLink("photos")}>
          Photos
        </button>
        <button
          type="button"
          className={`${styles.container__link} ${props.activeLink === "friends" ? styles.container__link_active : ""}`}
          disabled={props.loading}
          onClick={() => props.onChangeActiveLink("friends")}>
          Friends
        </button>
      </section>
      <section className={styles.container__data}>
        {
          props.loading
          ? <Spinner />
          : props.children
        }
      </section>
    </main>
  );
};

export default ProfileDataContainer;