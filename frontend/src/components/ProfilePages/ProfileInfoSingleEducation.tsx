import { FC, memo, useCallback } from 'react';
import styles from '../../styles/components/profilePages/profileInfoSingleEducation.module.scss';
import { formatDateToYearMonthAndDay } from '../../utils/formatDateToYearMonthAndDay';
import { IProfileInfoType } from '../../types/profilePages/profileInfo';
import IconBtn from '../Buttons/IconBtn';

interface Props {
  eduType: "college" | "education";
  education: {
    _id: string;
    name: string;
    country?: string;
    state?: string;
    city?: string;
    status: string;
    graduateDate?: Date;
  };
  isAuthUser?: boolean;
  onPrepareEditProfileInfoItem?: (itemId: string) => void;
  onPrepareDeleteProfileInfoItem?: (itemId: string | null, itemType: IProfileInfoType, title: string, text: string) => void;
}

const ProfileInfoSingleEducation: FC<Props> = (props) => {
  const onPrepareEditItem = useCallback(() => {
    props.onPrepareEditProfileInfoItem!(props.education._id);
  }, [props.education._id, props.onPrepareEditProfileInfoItem]);

  const onPrepareDeleteItem = useCallback((): void => {
    let itemType: IProfileInfoType = "colleges";
    let title = "Prepairing to delete college info";
    let text = "Are you sure you want to delete this college info?";
    if(props.eduType === "education") {
      itemType = "educationOther";
      title = "Prepairing to delete education info";
      text = "Are you sure you want to delete this education info?";
    }
    
    props.onPrepareDeleteProfileInfoItem!(props.education._id, itemType, title, text);
  }, [props.eduType, props.onPrepareDeleteProfileInfoItem, props.education._id]);

  return (
    <div className={styles.edu}>
      <div className={styles.edu__content}>
        {props.education.status === "finished" ? "Graduated " : "Goes to "} <span>{props.education.name}</span> {props.education.country ? "in" : ""} {props.education.country ? <span>{props.education.country}</span> : ""} {props.education.state ? <span>/{props.education.state}</span> : ""} {props.education.city ? <span>/{props.education.city}</span> : ""} {props.education.status === "finished" && props.education.graduateDate ? "on" : ""} {props.education.status === "finished" && props.education.graduateDate ? <span>{formatDateToYearMonthAndDay(props.education.graduateDate)}</span> : ""}
      </div>
      {
        props.isAuthUser && (
          <div className={styles.edu__btns}>
            <IconBtn
              color="btn__blue"
              text="edit education"
              icon={<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>}
              onClick={onPrepareEditItem} />
            <IconBtn
              color="btn__red"
              text="delete education"
              icon={<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path></svg>}
              onClick={onPrepareDeleteItem} />
          </div>
        )
      }
    </div>
  );
};

export default memo(ProfileInfoSingleEducation);