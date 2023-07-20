import { FC, memo } from 'react';
import styles from '../../styles/components/headers/authHeader.module.scss';
// components
import HeaderLink from './HeaderLink';

const AuthHeader: FC = () => {
  return (
    <header className={styles.header}>
      <section className={styles.header__bcg}></section>
      <section className={styles.header__content}>
        <article className={styles.header__logo}>
          <div className={styles.header__logo_icon}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="128" cy="96" r="48" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></circle><circle cx="256" cy="416" r="48" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></circle><path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 256v112"></path><circle cx="384" cy="96" r="48" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></circle><path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M128 144c0 74.67 68.92 112 128 112m128-112c0 74.67-68.92 112-128 112"></path></svg>
          </div>
          <div className={styles.header__logo_text}>
            <p className={`${styles.header__logo_text_piece} ${styles.header__logo_text_piece_first}`}>
              Social
            </p>
            <p className={`${styles.header__logo_text_piece} ${styles.header__logo_text_piece_last}`}>
              Network
            </p>
          </div>
        </article>
        <article className={styles.header__right}>
          <HeaderLink
            path="/auth"
            text="signup / login" />
          <HeaderLink
            path="/info"
            text="app info" />
        </article>
      </section>
    </header>
  );
};

export default memo(AuthHeader);