import { FC, memo } from 'react';
import styles from '../../styles/components/forms/formTitle.module.scss';

interface Props {
  hasCloseBtn: boolean;
  text: string;
  textAlign: "center" | "left";
}

const FormTitle: FC<Props> = (props) => {
  return (
    <div className={styles.title}>
      <p className={`${styles.title__text} ${props.textAlign === "center" ? styles.title__text_center : ""}`}>
        {props.text}
      </p>
    </div>
  );
};

export default memo(FormTitle);