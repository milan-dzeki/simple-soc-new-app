import { FC, ChangeEventHandler, ChangeEvent, FormEventHandler } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/modals/createPhotoAlbumModal.module.scss';
// types
import { IInput } from '../../types/formsAndInputs/inputType';
// components
import Backdrop from '../Shared/Backdrop';
import Input from '../Inputs/Input';
import MultiphotoWithDescriptionsInput from '../Inputs/MultiphotoWithDescriptionsInput';
import ModalBtn from '../Buttons/ModalBtn';
import ModalTitle from './ModalTitle';

interface Props {
  show: boolean;
  albumNameInput: {[group: string]: IInput};
  filePreviews: string[];
  descriptions: string[];
  actionType: "create" | "addPhotos" | "editName" | null;
  onAlbumNameInputFocused: () => void;
  onAlbumNameInputUnfocused: () => void;
  onAlbumNameInputChanged: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onClose: () => void;
  onUploadPhotos: ChangeEventHandler<HTMLInputElement>;
  onInputDescriptionChanged: (event: ChangeEvent<HTMLInputElement>, descIndex: number) => void;
  onRemoveSinglePhotoForUpload: (photoIndex: number) => void;
  onCreatePhotoAlbum: FormEventHandler<HTMLFormElement>;
  onAddPhotosToAlbum: FormEventHandler<HTMLFormElement>;
  onEditAlbumName: FormEventHandler<HTMLFormElement>;
  formValid: boolean;
}

const CreatePhotoAlbumModal: FC<Props> = (props) => {
  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onClose} />
      <div className={styles.modal}>
        <ModalTitle
          text={
            props.actionType === "addPhotos"
            ? "Add Photos to Album"
            : props.actionType === "create"
            ? "Create New Album"
            : props.actionType === "editName"
            ? "Editing album name"
            : ""
          }
          isErrorModal={false}
          onClose={props.onClose} />
        <form 
          className={styles.modal__form} 
          onSubmit={
            props.actionType === "create" 
            ? props.onCreatePhotoAlbum
            : props.actionType === "addPhotos"
            ? props.onAddPhotosToAlbum
            : props.actionType === "editName"
            ? props.onEditAlbumName
            : () => {return}
          }>
          <div className={styles.modal__inputs}>
            {
              (props.actionType === "create" || props.actionType === "editName") && (
                <Input
                  {
                    ...props.albumNameInput.albumName
                  }
                  inputGroup="albumName"
                  onInputFocus={props.onAlbumNameInputFocused}
                  onInputUnfocus={props.onAlbumNameInputUnfocused}
                  onInputChange={props.onAlbumNameInputChanged} />
              )
            }
            {
              props.actionType && props.actionType !== "editName" && (
                <MultiphotoWithDescriptionsInput
                  filePreviews={props.filePreviews}
                  descriptions={props.descriptions}
                  onChange={props.onUploadPhotos}
                  onInputDescriptionChanged={props.onInputDescriptionChanged}
                  onRemoveSinglePhotoForUpload={props.onRemoveSinglePhotoForUpload} />
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
              btnText={
                props.actionType === "addPhotos"
                ? "add photos"
                : props.actionType === "create"
                ? "create album"
                : props.actionType === "editName"
                ? "edit name"
                : ""
              }
              disabled={!props.formValid} />
          </div>
        </form>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default CreatePhotoAlbumModal;