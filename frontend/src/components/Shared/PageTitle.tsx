import { FC } from 'react';
import styles from '../../styles/components/shared/pageTitle.module.scss';

interface Props {
  titleText: string;
  textAlign: "title__center" | "title__left";
}

const PageTitle: FC<Props> = (props) => {
  return (
    <div className={`${styles.title} ${styles[props.textAlign]}`}>
      <h1 className={styles.title__text}>
        {props.titleText}
      </h1>
      <div className={styles.title__underline}></div>
    </div>
  );
};

export default PageTitle;