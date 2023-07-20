import { FC } from 'react';
import styles from '../../styles/components/profilePages/profileInfo.module.scss';
// types
import { IProfile } from '../../types/profilePages/profileInfo';
import { IUser } from '../../types/profilePages/userProfile';
// componants
import ProfileInfoSingleJob from './ProfileInfoSingleJob';
import ProfileInfoSingleResidence from './ProfileInfoSingleResidence';
import ProfileInfoSingleEducation from './ProfileInfoSingleEducation';
// utils
import { formatDateToYearMonthAndDay } from '../../utils/formatDateToYearMonthAndDay';

interface Props {
  user: IUser;
  isAuthUser: boolean;
  profile: IProfile | null;
}

const ProfileInfoUser: FC<Props> = (props) => {
  return (
    <div className={styles.info}>
      {
        !props.profile || (props.profile && Object.keys(props.profile).length === 0)
        ? <p className={styles.info__no_profile}>Data not available</p>
        : (
          <div className={styles.info__content}>
            <div className={styles.info__top}>
                <div className={`${styles.info__box} ${styles.info__box_basic}`}>
                  <div className={styles.info__box_title}>
                    <h4>Basic Info</h4>
                  </div>
                  <div className={styles.info__box_data}>
                    <div className={styles.info__box_data_item}>
                      <p className={styles.info__box_data_item_value}>
                        <span className={styles.key}>Full Name: </span><span className={styles.value}>{props.user.fullName}</span>
                      </p>
                    </div>
                    <div className={styles.info__box_data_item}>
                      <p className={styles.info__box_data_item_value}>
                        <span className={styles.key}>Email: </span><span className={styles.value}>{props.user.email}</span>
                      </p>
                    </div>
                    <div className={styles.info__box_data_item}>
                      <p className={styles.info__box_data_item_value}>
                        <span className={styles.key}>Birthday: </span><span className={styles.value}>{props.user.dateOfBirth || "No data"}</span>
                      </p>
                    </div>
                    <div className={styles.info__box_data_item}>
                      <p className={styles.info__box_data_item_value}>
                        <span className={styles.key}>Gender: </span><span className={styles.value}>{props.user.gender}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`${styles.info__box} ${styles.info__box_work}`}>
                  <div className={styles.info__box_title}>
                    <h4>Work</h4>
                  </div>
                  <div className={styles.info__box_dataflex}>
                    <div className={styles.info__box_dataflex_subbox}>
                      <div className={styles.title}>
                        <h4>Current Jobs</h4>
                      </div>
                      <div className={styles.items}>
                        {
                          props.profile.jobs.length === 0 || (props.profile.jobs.length > 0 && props.profile.jobs.every(job => !job.role))
                          ? <p className={styles.no_info}>No Info</p>
                          : props.profile.jobs.map(job => {
                            return (
                              <ProfileInfoSingleJob
                                key={job._id}
                                jobType="current"
                                job={job}
                                isAuthUser={props.isAuthUser} />
                            );
                          })
                        }
                      </div>
                    </div>
                    <div className={`${styles.info__box_dataflex_subbox} ${styles.info__box_dataflex_subbox__stretch}`}>
                      <div className={styles.title}>
                        <h4>Previous Jobs</h4>
                      </div>
                      <div className={styles.items}>
                        {
                          props.profile.previousJobs.length === 0 || (props.profile.previousJobs.length > 0 && props.profile.previousJobs.every(job => !job.role))
                          ? <p className={styles.no_info}>No Info</p>
                          : props.profile.previousJobs.map(job => {
                            return (
                              <ProfileInfoSingleJob
                                key={job._id}
                                jobType="previous"
                                job={job}
                                isAuthUser={props.isAuthUser} />
                            );
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.info__bottom}>
                <div className={styles.info__box}>
                  <div className={styles.info__box_title}>
                    <h4>Education</h4>
                  </div>
                  <div className={styles.info__box_dataflex}>
                    <div className={styles.info__box_dataflex_subbox}>
                      <div className={styles.title}>
                        <h4>High School</h4>
                      </div>
                      <div className={styles.items}>
                        {
                          !props.profile.highSchool || (props.profile.highSchool && !props.profile.highSchool.name)
                          ? <p className={styles.no_info}>No Info</p>
                          : (
                            <div className={styles.item}>
                              <p className={styles.item__info}>{props.profile.highSchool.status === "finished" ? "Graduated " : "Goes to "} <span>{props.profile.highSchool.name}</span> {props.profile.highSchool.country ? "in" : ""} {props.profile.highSchool.country ? <span>{props.profile.highSchool.country}</span> : ""} {props.profile.highSchool.state ? <span>/{props.profile.highSchool.state}</span> : ""} {props.profile.highSchool.city ? <span>/{props.profile.highSchool.city}</span> : ""} {props.profile.highSchool.status === "finished" && props.profile.highSchool.graduateDate ? "on" : ""} {props.profile.highSchool.status === "finished" && props.profile.highSchool.graduateDate ? <span>{formatDateToYearMonthAndDay(props.profile.highSchool.graduateDate)}</span> : ""}</p>
                            </div>
                          )
                        }
                      </div>
                    </div>
                    <div className={`${styles.info__box_dataflex_subbox} ${styles.info__box_dataflex_subbox__stretch}`}>
                      <div className={styles.title}>
                        <h4>Colleges</h4>
                      </div>
                      <div className={styles.items}>
                        {
                          props.profile.colleges.length === 0 || (props.profile.colleges.length > 0 && props.profile.colleges.every(coll => !coll.name))
                          ? <p className={styles.no_info}>No Info</p>
                          : props.profile.colleges.map(coll => {
                            return (
                              <ProfileInfoSingleEducation
                                key={coll._id}
                                education={coll}
                                eduType="college"
                                isAuthUser={props.isAuthUser} />
                            );
                          })
                        }
                      </div>
                    </div>
                    <div className={`${styles.info__box_dataflex_subbox} ${styles.info__box_dataflex_subbox__stretch}`}>
                      <div className={styles.title}>
                        <h4>Other</h4>
                      </div>
                      <div className={styles.items}>
                        {
                          props.profile.educationOther.length === 0 || (props.profile.educationOther.length > 0 && props.profile.educationOther.every(ed => !ed.name))
                          ? <p className={styles.no_info}>No Info</p>
                          : props.profile.educationOther.map(edu => {
                            return (
                              <ProfileInfoSingleEducation
                                key={edu._id}
                                education={edu}
                                eduType="education"
                                isAuthUser={props.isAuthUser} />
                            );
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.info__box}>
                  <div className={styles.info__box_title}>
                    <h4>Residences</h4>
                  </div>
                  <div className={styles.info__box_dataflex}>
                    <div className={styles.info__box_dataflex_subbox}>
                      <div className={styles.title}>
                        <h4>Current</h4>
                      </div>
                      <div className={styles.items}>
                        {
                          !props.profile.currentResidence || (props.profile.currentResidence && !props.profile.currentResidence.country)
                          ? <p className={styles.no_info}>No Info</p>
                          : (
                            <ProfileInfoSingleResidence
                              residenceType="current"
                              residence={props.profile.currentResidence}
                              isAuthUser={props.isAuthUser} />
                          )
                        }
                      </div>
                    </div>
                    <div className={`${styles.info__box_dataflex_subbox} ${styles.info__box_dataflex_subbox__stretch}`}>
                      <div className={styles.title}>
                        <h4>Previous</h4>
                      </div>
                      <div className={styles.items}>
                        {
                          props.profile.previousResidences.length === 0 || (props.profile.previousResidences.length > 0 && props.profile.previousResidences.every(resid => !resid.country))
                          ? <p className={styles.no_info}>No Info</p>
                          : props.profile.previousResidences.map(resid => {
                            return (
                              <ProfileInfoSingleResidence
                                key={resid._id}
                                residenceType="previous"
                                residence={resid}
                                isAuthUser={props.isAuthUser} />
                            );
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )
      }
    </div>
  );
};

export default ProfileInfoUser;