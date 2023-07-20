import { ChangeEvent, ChangeEventHandler, FC, FormEventHandler } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/chatsAndMessages/sendMessageModal.module.scss';
// types
import { IInput } from '../../types/formsAndInputs/inputType';
// components
import Backdrop from '../Shared/Backdrop';
import Input from '../Inputs/Input';
import PhotoInput from '../Inputs/PhotoInput';
import ModalBtn from '../Buttons/ModalBtn';
import ModalTitle from '../Modals/ModalTitle';
import Spinner from '../Shared/Spinner';

interface Props {
  show: boolean;
  loading: boolean;
  friendToSentMessageName: string;
  onClose: () => void;
  messageTextInput: {[group: string]: IInput};
  onMessageTextFocused: () => void;
  onMessageTextUnfocused: () => void;
  onMessageTextChanged: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  photoFile: File | null;
  photoPreview: string | null;
  onUploadPhoto: ChangeEventHandler<HTMLInputElement>;
  onRemovePhoto: () => void;
  onSendMessageToUser: FormEventHandler<HTMLFormElement>;
}

const SendMessageModal: FC<Props> = (props) => {
  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onClose} />
      <div className={styles.modal}>
        <div className={styles.modal__content}>
          <ModalTitle
            text={`Send Message to ${props.friendToSentMessageName}`}
            onClose={props.onClose} />
          {
            props.loading
            ? <Spinner />
            : (
                <form className={styles.modal__body} onSubmit={props.onSendMessageToUser}>
                  <Input
                    {...props.messageTextInput.messageText}
                    inputGroup="messageText"
                    onInputFocus={props.onMessageTextFocused}
                    onInputUnfocus={props.onMessageTextUnfocused}
                    onInputChange={props.onMessageTextChanged} />
                  <PhotoInput
                    photoFile={props.photoFile}
                    photoPreview={props.photoPreview}
                    inputText="Upload Message Photo"
                    onPrepareProfilePhoto={props.onUploadPhoto}
                    onRemoveProfilePhoto={props.onRemovePhoto} />
                  <div className={styles.modal__btns}>
                    <ModalBtn
                      btnType="button"
                      btnCustomType="btn__cancel"
                      btnText="cancel"
                      onClick={props.onClose} />
                    <ModalBtn
                      btnType="submit"
                      btnCustomType="btn__confirm"
                      btnText="send"
                      disabled={props.messageTextInput.messageText.value.trim().length === 0 && !props.photoFile} />
                  </div>
                </form>
            )
          }
        </div>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default SendMessageModal;