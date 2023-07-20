import { FC } from 'react';
import styles from '../../styles/components/shared/pageContainer.module.scss';
import PageTitle from './PageTitle';

interface Props {
  loading: boolean;
  width: "medium" | "big";
  display: "container__block" | "container__flex";
  children: React.ReactNode;
  hasPageTitle: boolean;
  titleText?: string;
  titleTextAlign?: "title__center" | "title__left";
}

const PageContainer: FC<Props> = (props) => {
  return (
    <main className={`${styles.container} ${styles[props.display]} ${styles[props.width]}`}>
      {props.hasPageTitle && props.titleText && props.titleTextAlign && (
        <PageTitle
          titleText={props.titleText}
          textAlign={props.titleTextAlign} />
      )}
      <section className={styles.container__data}>
        {props.children}
      </section>
    </main>
  );
};

export default PageContainer;