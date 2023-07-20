import { FC } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/modals/friendsAndUsersModal.module.scss';
import Backdrop from '../Shared/Backdrop';
import ModalSingleFriend from '../Friends/ModalSingleFriend';
import ModalTitle from './ModalTitle';

interface Props {
  show: boolean;
  title: string;
  friends: {_id: string; fullName: string; profilePhotoUrl: string}[];
  onClose: () => void;
}

const FriendsAndUsersModal: FC<Props> = (props) => {
  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onClose} />
      <div className={styles.modal}>
        <ModalTitle
          text={props.title}
          onClose={props.onClose} />
        <div className={styles.modal__list}>
          {
            props.friends.map(user => {
              return (
                <ModalSingleFriend
                  key={user._id}
                  id={user._id}
                  fullName={user.fullName}
                  profilePhotoUrl={user.profilePhotoUrl} />
              );
            })
          }
        </div>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default FriendsAndUsersModal;