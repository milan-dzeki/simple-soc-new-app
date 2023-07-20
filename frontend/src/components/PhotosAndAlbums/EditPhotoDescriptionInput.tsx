import { ChangeEvent, FC, FormEventHandler, memo } from 'react';
import styles from '../../styles/components/photosAndAlbums/editPhotoDescriptionInput.module.scss';
import { IInput } from '../../types/formsAndInputs/inputType';
import Backdrop from '../Shared/Backdrop';
import Input from '../Inputs/Input';

interface Props {
  show: boolean;
  input: {[group: string]: IInput};
  loading: boolean;
  onClose: () => void;
  onEditPhotoDescInputFocused: (inputGroup: string) => void;
  onEditPhotoDescInputUnfocused: (inputGroup: string) => void;
  onEditPhotoDescInputChanged: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  submitDisabled: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const EditPhotoDescriptionInput: FC<Props> = (props) => {
  return (
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onClose}
        hiperZIndex={true} />
      <form className={styles.input} onSubmit={props.onSubmit}>
        <div className={styles.input__field}>
          <Input
            {...props.input.description}
            inputGroup="description"
            onInputFocus={props.onEditPhotoDescInputFocused}
            onInputUnfocus={props.onEditPhotoDescInputUnfocused}
            onInputChange={props.onEditPhotoDescInputChanged} />
        </div>
        {
          !props.loading && (
            <div className={styles.input__btns}>
              <button
                type="submit"
                className={`${styles.input__btn} ${styles.input__btn_submit}`}
                disabled={!props.submitDisabled}>
                edit
              </button>
              <button
                type="button"
                className={`${styles.input__btn} ${styles.input__btn_cancel}`}
                onClick={props.onClose}>
                cancel
              </button>
            </div>
          )
        }
      </form>
    </>
  );
};

export default memo(EditPhotoDescriptionInput);