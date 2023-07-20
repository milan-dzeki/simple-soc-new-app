import { FC, ChangeEventHandler, memo } from 'react';
import styles from '../../styles/components/inputs/authFormPhotoInput.module.scss';

interface Props {
  photoFile: File | null;
  inputText: string;
  photoPreview: string | null;
  onPrepareProfilePhoto: ChangeEventHandler<HTMLInputElement>;
  onRemoveProfilePhoto: () => void;
}

const PhotoInput: FC<Props> = (props) => {
  return (
    <div className={styles.input}>
      <div className={styles.input__left}>
        <div className={styles.input__photo}>
          {
            props.photoFile && props.photoPreview
            ? <img src={props.photoPreview} alt="profile_photo" />
            : <div className={styles.input__no_photo}>
                No Photo
              </div>
          }
        </div>
        {props.photoFile && props.photoPreview && (
          <button
            type="button"
            className={styles.input__btn}
            onClick={props.onRemoveProfilePhoto}>
            remove photo
          </button>
        )}
      </div>
      <label className={styles.input__label} htmlFor="photo">
        <input type="file" name="photo" id="photo" accept="image/*" onChange={props.onPrepareProfilePhoto} />
        <span className={styles.input__text}>
          {
            props.photoFile && props.photoPreview
            ? "Upload another photo"
            : props.inputText
          }
        </span>
      </label>
    </div>
  );
};

export default memo(PhotoInput);