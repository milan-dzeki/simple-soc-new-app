import { FC, ChangeEventHandler, ChangeEvent, memo } from 'react';
import styles from '../../styles/components/inputs/multiphotoWthDescriptionsInput.module.scss';
import CloseBtn from '../Buttons/CloseBtn';

interface Props {
  filePreviews: string[];
  descriptions: string[];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onInputDescriptionChanged: (event: ChangeEvent<HTMLInputElement>, descIndex: number) => void;
  onRemoveSinglePhotoForUpload: (photoIndex: number) => void;
}

const MultiphotoWithDescriptionsInput: FC<Props> = (props) => {
  return (
    <div className={styles.input}>
      <label htmlFor="photos" className={styles.input__label}>
        <span className={styles.input__label_icon}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </span>
        <span className={styles.input__label_text}>
          Add Photos
        </span>
        <input 
          type="file"
          id="photos"
          name="photos"
          multiple
          accept="image/*"
          onChange={props.onChange} />
      </label>
      {
        props.filePreviews.length > 0 && (
          <div className={styles.input__previews}>
            <p className={styles.input__previews_title}>
              Photos ready to go
            </p>
            <div className={styles.input__previews_list}>
              {props.filePreviews.map((photo, i) => {
                return (
                  <div
                    key={photo}
                    className={styles.input__preview}>
                    <CloseBtn
                      size="btn__small"
                      position="btn__absolute"
                      onClick={() => props.onRemoveSinglePhotoForUpload(i)} />
                    <div className={styles.input__preview_img}>
                      <img src={photo} alt="photoPreview" />
                    </div>
                    <div className={styles.input__preview_desc}>
                      <label htmlFor={`desc_${i}`} className={styles.input__preview_desc_label}>
                        photo {i + 1} description:
                      </label>
                      <input 
                        type="text"
                        value={props.descriptions[i] || ""}
                        onChange={(event) => props.onInputDescriptionChanged(event, i)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    </div>
  );
};

export default memo(MultiphotoWithDescriptionsInput);