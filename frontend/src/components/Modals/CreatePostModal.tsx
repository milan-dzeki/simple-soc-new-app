import { FC, FormEventHandler, ChangeEvent, ChangeEventHandler, lazy, memo, useState, useCallback } from 'react';
import styles from '../../styles/components/modals/createPostModal.module.scss';
import ReactDOM from 'react-dom';
// types
import { IInput } from '../../types/formsAndInputs/inputType';
import { IFriend } from '../../store/types/friendsTypes';
// components
import Backdrop from '../Shared/Backdrop';
import ModalBtn from '../Buttons/ModalBtn';
import Input from '../Inputs/Input';
import ModalTitle from './ModalTitle';
import MultiphotoWithDescriptionsInput from '../Inputs/MultiphotoWithDescriptionsInput';
import TaggFriendsModal from './TaggFriendsModal';
import Spinner from '../Shared/Spinner';

const TaggedFriend = lazy(() => import('../Friends/TaggedFriend'));

interface Props {
  show: boolean;
  loading: boolean;
  postTextInput: {[group: string]: IInput};
  photoFiles: File[];
  photoPreviews: string[];
  photoDescriptions: string[];
  postTaggs: {
    userId: string;
    userFullName: string;
  }[];
  onAddPostTaggs: (friends: IFriend[], checked: {[name: string]: boolean}) => void;
  onUploadPostPhotos: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInputDescriptionChanged: (event: ChangeEvent<HTMLInputElement>, descIndex: number) => void;
  onRemoveSinglePhotoForUpload: (photoIndex: number) => void;
  onRemoveSingleTagg: (userId: string) => void;
  onPostTextInputFocused: () => void;
  onPostTextInputUnfocused: () => void;
  onPostTextInputChanged: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onClose: () => void;
  onCreatePost: FormEventHandler<HTMLFormElement>;
}

const CreatePostModal: FC<Props> = (props) => {
  const { onAddPostTaggs } = props;
  const [taggFriendsShow, setTaggFriendsShow] = useState(false);

  const onCloseTaggFriendsModal = useCallback((): void => {
    setTaggFriendsShow(false);
  }, []);

  const onSetTaggs = useCallback((friends: IFriend[], checked: {[name: string]: boolean}): void => {
    onAddPostTaggs(friends, checked);
    setTaggFriendsShow(false);
  }, [onAddPostTaggs]);
  
  if(taggFriendsShow) return (
    <TaggFriendsModal
      show={taggFriendsShow}
      taggs={props.postTaggs}
      onSetTaggs={onSetTaggs}
      onClose={onCloseTaggFriendsModal} />
  );

  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onClose} />
      <div className={styles.modal}>
        <div className={styles.modal__content}>
          <ModalTitle
            text="Create Post"
            onClose={props.onClose}
            loading={props.loading} />
          <form 
            className={styles.modal__form}
            onSubmit={props.onCreatePost}>
            {
              props.loading
              ? <Spinner />
              : (
                <>
                  <div className={styles.modal__inputs}>
                    <Input
                      {...props.postTextInput.postText}
                      inputGroup="none"
                      onInputFocus={props.onPostTextInputFocused}
                      onInputUnfocus={props.onPostTextInputUnfocused}
                      onInputChange={props.onPostTextInputChanged} />
                    <MultiphotoWithDescriptionsInput
                      filePreviews={props.photoPreviews}
                      descriptions={props.photoDescriptions}
                      onChange={props.onUploadPostPhotos}
                      onInputDescriptionChanged={props.onInputDescriptionChanged}
                      onRemoveSinglePhotoForUpload={props.onRemoveSinglePhotoForUpload} />
                    <div 
                      className={styles.modal__tagg}
                      onClick={() => setTaggFriendsShow(true)}>
                      <span className={styles.modal__tagg_icon}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"></path></svg>
                      </span>
                      <span className={styles.modal__tagg_text}>
                        Tagg Friends
                      </span>
                    </div>
                    {
                      props.postTaggs.length > 0 && (
                        <div className={styles.modal__tagged}>
                          <p className={styles.modal__tagged_title}>
                            Tagged Friends
                          </p>
                          <div className={styles.modal__tagged_list}>
                            {props.postTaggs.map(friend => {
                              return (
                                <TaggedFriend
                                  key={friend.userId}
                                  name={friend.userFullName}
                                  onRemove={() => props.onRemoveSingleTagg(friend.userId)} />
                              );
                            })}
                          </div>
                        </div>
                      )
                    }
                  </div>
                  <div className={styles.modal__btns}>
                    <ModalBtn
                      btnType="button"
                      btnCustomType="btn__cancel"
                      btnText="cancel"
                      onClick={props.onClose} />
                    <ModalBtn
                      btnType="submit"
                      btnCustomType="btn__confirm"
                      btnText="create"
                      disabled={props.postTextInput.postText.value.trim().length === 0 && props.photoFiles.length === 0 && props.postTaggs.length === 0} />
                  </div>
                </>
              )
            }
          </form>
        </div>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default memo(CreatePostModal);