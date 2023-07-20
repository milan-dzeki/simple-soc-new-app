import { FC } from 'react';
import styles from '../../styles/components/searchPage/searchButtons.module.scss';

interface Props {
  searched: boolean;
  activeBtn: "newest" | "know" | "search";
  onGetUsersByUrl: (url: string, activeBtn: "newest" | "know") => Promise<void>;
  onSelectSearchResults: () => void;
}

const SearchButtons: FC<Props> = (props) => {
  return (
    <div className={styles.btns}>
      <button
        type="button"
        className={`${styles.btns__btn} ${props.activeBtn === "newest" ? styles.btns__btn_active : ""}`}
        onClick={() => props.onGetUsersByUrl("/lastJoined", "newest")}>
        10 newest people
      </button>
      <button
        type="button"
        className={`${styles.btns__btn} ${props.activeBtn === "know" ? styles.btns__btn_active : ""}`}
        onClick={() => props.onGetUsersByUrl("/peopleYouMayKnow", "know")}>
        people you may know
      </button>
      {
        props.searched && (
          <button
            type="button"
            className={`${styles.btns__btn} ${props.activeBtn === "search" ? styles.btns__btn_active : ""}`}
            onClick={props.onSelectSearchResults}>
            search results
          </button>
        )
      }
    </div>
  );
};

export default SearchButtons;