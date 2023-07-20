import { FC, memo } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/modals/defaultModal.module.scss';
// components
import Backdrop from '../Shared/Backdrop';
import Spinner from '../Shared/Spinner';
import ModalTitle from './ModalTitle';

interface Props {
  show: boolean;
  isErrorModal: boolean;
  title: string;
  text: string;
  children: React.ReactNode;
  onClose: () => void;
  loading?: boolean;
}

const DefaultModal: FC<Props> = (props) => {
  return ReactDOM.createPortal(
    <>
      <Backdrop show={props.show} bcgColor="dark" onClose={props.onClose} />
      <div className={`${styles.modal} ${props.isErrorModal ? styles.modal__error : ""}`}>
        <ModalTitle
          text={props.title}
          isErrorModal={props.isErrorModal}
          onClose={props.onClose}
          loading={props.loading || false} />
        <div className={styles.modal__body}>
          {
            props.loading
            ? <Spinner />
            : (
              <>
                <p className={styles.modal__text}>
                  {props.text}
                </p>
                <div className={styles.modal__btns}>
                  {props.children}
                </div>
              </>
            )
          }
        </div>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default memo(DefaultModal);