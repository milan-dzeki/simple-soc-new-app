import { FC, ChangeEventHandler, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/modals/taggFriendsModal.module.scss';
import noUserImg from '../../images/no-user.jpg';
// hooks
import { useTypedSelector } from '../../hooks/useTypedSelector';
// types
import { IFriend } from '../../store/types/friendsTypes';
// components
import Backdrop from '../Shared/Backdrop';
import ModalTitle from './ModalTitle';

interface Props {
  show: boolean;
  onClose: () => void;
  taggs: {
    userId: string;
    userFullName: string;
  }[];
  onSetTaggs: (friends: IFriend[], checked: {[name: string]: boolean}) => void;
}

const TaggFriendsModal: FC<Props> = (props) => {
  const { friends } = useTypedSelector(state => state.friends);

  const [displayedFriends, setDisplayedFriends] = useState([...friends]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [checkFields, setCheckFields] = useState<{[id: string]: boolean}>({});

  useEffect(() => {
    const checks: {[id: string]: boolean} = {};
    friends.forEach(friend => {
      const isChecked = props.taggs.find(tagg => tagg.userId === friend.user._id);
      if(isChecked) {
        checks[friend.user._id] = true;
      } else {
        checks[friend.user._id] = false;
      }
    });
    setCheckFields(checks);
    setDisplayedFriends([...friends]);
  }, [friends, props.taggs]);

  const onToggleCheckFriends: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target;
    setCheckFields(prev => {
      return {
        ...prev,
        [target.name]: !prev[target.name]
      };
    });
  };

  const onSearchFriends: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target;
    setSearchInputValue(target.value);

    const filteredFriends = friends.filter(friend => {
      return  friend.user.fullName.toLowerCase().includes(target.value.trim().toLowerCase());
    });

    setDisplayedFriends(filteredFriends);
  };

  const onClearSearchValue = (): void => {
    setSearchInputValue("");
    setDisplayedFriends([...friends]);
  };

  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onClose} />
      <div className={styles.modal}>
        <div className={styles.modal__content}>
          <ModalTitle
            text="Check friends you want to tagg"
            onClose={props.onClose} />
          <div className={styles.modal__body}>
            <div className={styles.modal__input}>
              <label htmlFor="search" className={styles.modal__input_label}>
                Search Friends
              </label>
              <input
                className={styles.modal__input_el} 
                type="text"
                name="search"
                id="search"
                value={searchInputValue}
                onChange={onSearchFriends} />
              {
                searchInputValue.trim().length > 0 && (
                  <button
                    type="button"
                    className={styles.modal__input_clear}
                    onClick={onClearSearchValue}>
                    clear
                  </button>
                )
              }
            </div>
            <div className={styles.modal__list}>
              {
                displayedFriends.length === 0
                ? <p className={styles.modal__list_empty}>No results</p>
                : displayedFriends.map(friend => {
                  return (
                    <div
                      key={friend.user._id}
                      className={styles.friend}>
                      <div className={styles.friend__info}>
                        <div className={styles.friend__image}>
                          <img src={friend.user.profilePhotoUrl || noUserImg} alt="friend" />
                        </div>
                        <p className={styles.friend__name}>
                          {friend.user.fullName}
                        </p>
                      </div>
                      <input
                        className={styles.friend__input} 
                        type="checkbox" 
                        name={friend.user._id}
                        id={friend.user._id}
                        checked={checkFields[friend.user._id] || false}
                        onChange={onToggleCheckFriends} />
                    </div>
                  );
                })
              }
            </div>
            <div className={styles.modal__btns}>
              <button
                type="button"
                className={`${styles.modal__btn} ${styles.modal__btn_cancel}`}
                onClick={props.onClose}>
                cancel
              </button>
              <button
                type="button"
                disabled={Object.keys(checkFields).find(field => checkFields[field] === true) === undefined}
                className={`${styles.modal__btn} ${styles.modal__btn_tagg}`}
                onClick={() => props.onSetTaggs(friends, checkFields)}>
                tagg selected friends
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default TaggFriendsModal;