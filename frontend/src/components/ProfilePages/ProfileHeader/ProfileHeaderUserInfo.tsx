import { ChangeEvent, FC } from 'react';
import styles from '../../../styles/components/profilePages/profileHeader.module.scss';
import noUserImg from '../../../images/no-user.jpg';
// types
import { IUser } from '../../../types/profilePages/userProfile';
// hooks
import { useDispatch } from 'react-redux';
// utils
import { formatDateToYearMonthAndDay } from '../../../utils/formatDateToYearMonthAndDay';
// redux
import { uploadNewProfilePhoto, removeProfilePhoto } from '../../../store/actions/authActions';

interface Props {
  user: IUser;
  isAuthUser?: boolean;
}

const ProfileHeaderUserInfo: FC<Props> = (props) => {
  const dispatch = useDispatch();

  const onUploadNewPhoto = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;

    if(target.files && target.files.length > 0) {
      const formData = new FormData();
      formData.append("photo", target.files[0]);
      dispatch(uploadNewProfilePhoto(formData));
    } else return;
  };

  const onRemoveProfilePhoto = (): void => {
    dispatch(removeProfilePhoto());
  };

  return (
    <div className={styles.header__left}>
      {
        props.isAuthUser
        ? (
          <div className={styles.header__photo_auth}>
            <div className={styles.header__photo_auth_img}>
              <img
                src={props.user.profilePhotoUrl || noUserImg}
                alt="user" />
            </div>
            <div className={styles.btns}>
              <label htmlFor="photo" className={styles.label}>
                <span className={styles.label__text}>Upload new</span>
                <input 
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                  onChange={onUploadNewPhoto} />
              </label>
              {
                props.user.profilePhotoUrl && (
                  <button 
                    className={styles.remove}
                    onClick={onRemoveProfilePhoto}>
                    remove photo
                  </button>
                )
              }
            </div>
          </div>
        ) 
        : (
          <div className={styles.header__photo}>
            <img
              src={props.user.profilePhotoUrl || noUserImg}
              alt="user" />
          </div>
        )
      }
      <div className={styles.header__middle}>
        <p className={styles.header__name}>
          {props.user.fullName}
        </p>
        <p className={styles.header__created}>
          joined: {formatDateToYearMonthAndDay(props.user.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeaderUserInfo;