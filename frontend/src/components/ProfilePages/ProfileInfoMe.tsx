import { FC, lazy, FormEventHandler, useState, useCallback } from 'react';
import styles from '../../styles/components/profilePages/profileInfo.module.scss';
import axiosProfile from '../../axios/axiosProfile';
// data
import { editUserInfoForm } from '../../config/myProfilePage/editUserInfoForm';
import { addOrEditHighSchoolForm } from '../../config/myProfilePage/addOrEditHighSchoolForm';
import { addOrEditCollegeForm } from '../../config/myProfilePage/addOrEditCollegeForm';
import { addOrEditEducationForm } from '../../config/myProfilePage/addOrEditEducationForm';
import { addOrEditPreviousJobForm } from '../../config/myProfilePage/addOrEditPreviousJobForm';
import { addOrEditCurrentJobForm } from '../../config/myProfilePage/addOrEditCurrentJobForm';
import { addOrEditPreviousResidenceForm } from '../../config/myProfilePage/addOrEditPreviousResidenceForm';
import { addOrEditCurrentResidenceForm } from '../../config/myProfilePage/addOrEditCurrentResidenceForm';
// hooks
import { useForm } from '../../hooks/useFormHook/useForm';
import { useDispatch } from 'react-redux';
// types
import { IProfile, IProfileInfoType, IHighSchool, ICurrentResidence, IPreviousResidence, ICollege, IEducationOther, ICurrentJob, IPreviousJob } from '../../types/profilePages/profileInfo';
import { IUser } from '../../types/profilePages/userProfile';
import { IForm } from '../../types/formsAndInputs/form';
import { IFormModalInfo, IFormModalType } from '../../types/profilePages/formModalState';
// components
import ProfileInfoSingleJob from './ProfileInfoSingleJob';
import ProfileInfoSingleResidence from './ProfileInfoSingleResidence';
import ProfileInfoSingleEducation from './ProfileInfoSingleEducation';
import DefaultModal from '../Modals/DefaultModal';
import ModalBtn from '../Buttons/ModalBtn';
import IconBtn from '../Buttons/IconBtn';
import Spinner from '../Shared/Spinner';
// utils
import { formatDateToYearMonthAndDay } from '../../utils/formatDateToYearMonthAndDay';
import { deepCloneInputs } from '../../utils/deepCloneInputs';
import { editUserData } from '../../store/actions/authActions';
import { months } from '../../utils/months';

const FormModal = lazy(() => import('../Modals/FormModal'));

interface Props {
  loading: boolean;
  profile: IProfile | null;
  isAuthUser: boolean;
  user: IUser;
  setMyProfileInfo: React.Dispatch<React.SetStateAction<IProfile | null>>;
}

const ProfileInfoMe: FC<Props> = ({loading, profile, isAuthUser, user, setMyProfileInfo}) => {
  const dispatch = useDispatch();
  const [formModalInfo, setFormModalInfo] = useState<IFormModalInfo>({
    show: false,
    formTitle: "",
    formType: "",
    itemId: null
  });

  const [changeDataLoading, setChangeDataLoading] = useState(false);
  const [changeDataErrorMsg, setChangeDateErrorMsg] = useState<string | null>(null);

  const {
    form,
    onSetForm,
    onGetUSStates,
    onGetCountries,
    onGetCitiesOfCountry,
    onGetUSStatesCities,
    onInputFocus,
    onCountryInputFocus,
    onInputUnfocus,
    onInputChange,
    onSelectInputChange,
    onRadioInputChange
  } = useForm(editUserInfoForm);

  const [deleteModalInfo, setDeleteModalInfo] = useState<{
    itemId: string | null;
    title: string;
    text: string;
    itemType: IProfileInfoType | null;
  }>({
    itemId: null,
    title: "",
    text: "",
    itemType: null
  });

  const onFormModalClose = (): void => {
    setFormModalInfo({
      show: false,
      formTitle: "",
      formType: ""
    });
  };

  const onClearErrorMsg = (): void => {
    setChangeDateErrorMsg(null);
  };

  // DATA DELETION //
  const onDeleteModalClose = (): void => {
    setDeleteModalInfo({
      itemId: null,
      title: "",
      text: "",
      itemType: null
    });
  };

  const onPrepareDeleteProfileInfoItem = useCallback((itemId: string | null, itemType: IProfileInfoType, title: string, text: string): void => {
    setDeleteModalInfo({
      itemId,
      title,
      text,
      itemType
    });
  }, []);

  const onDeleteSingleInfoItem = useCallback(async(): Promise<void> => {
    setChangeDataLoading(true);

    let url = "";
    if(deleteModalInfo.itemType) {
      if(deleteModalInfo.itemId) {
        if(deleteModalInfo.itemType === "jobs") {
          url = `/currentJob/${deleteModalInfo.itemId}`;
        } else if(deleteModalInfo.itemType === "previousJobs") {
          url = `/prevJob/${deleteModalInfo.itemId}`;
        } else if(deleteModalInfo.itemType === "colleges") {
          url = `/collegeOrEdu/colleges/${deleteModalInfo.itemId}`;
        } else if(deleteModalInfo.itemType === "educationOther") {
          url = `/collegeOrEdu/educationOther/${deleteModalInfo.itemId}`;
        } else if(deleteModalInfo.itemType === "previousResidences") {
          url = `/prevResidences/${deleteModalInfo.itemId}`;
        }
      } else {
        if(deleteModalInfo.itemType === "currentResidence") {
          url = "/curResidence";
        } else if(deleteModalInfo.itemType === "highSchool") {
          url = "/highSchool";
        }
      }

      const token = localStorage.getItem("socNetAppToken");

      try {
        await axiosProfile.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if(deleteModalInfo.itemType === "currentResidence") {
          setMyProfileInfo((prev: any) => {
            if(prev === null) return prev;
            return {
              ...prev,
              currentResidence: {}
            };
          });
        } else if(deleteModalInfo.itemType === "highSchool") {
          setMyProfileInfo((prev: any) => {
            if(prev === null) return prev;
            return {
              ...prev,
              highSchool: {}
            };
          });
        } else {
          setMyProfileInfo((prev: any) => {
            if(prev === null) return prev;
            if(Array.isArray(prev[deleteModalInfo.itemType!])) {
              const targetList = prev[deleteModalInfo.itemType!].filter((item: any) => item._id !== deleteModalInfo.itemId!)
              return {
                ...prev,
                [deleteModalInfo.itemType!]: targetList
              };
            } else return prev;
            
          });
        }

        onDeleteModalClose();
        setChangeDataLoading(false);
      } catch(error) {
        setChangeDateErrorMsg((error as any).response.data.message);
      }
    }
  }, [deleteModalInfo.itemId, deleteModalInfo.itemType, setMyProfileInfo]);

  ////////////////////////////////////////////////////////////////////////////
  // FORM OPENING FOR ADDING OR EDITING

  const onOpenModalForAuthData = (): void => {
    setFormModalInfo({
      show: true,
      formTitle: "Editing My Info",
      formType: "editInfo"
    });
    
    let inputs = deepCloneInputs(editUserInfoForm.inputs);
    
    const splitName = user.fullName.split(" ");
    inputs.info.firstName.value = splitName[0];
    inputs.info.firstName.valid = true;
    inputs.info.firstName.touched = true;
    inputs.info.lastName.value = splitName[1];
    inputs.info.lastName.valid = true;
    inputs.info.lastName.touched = true;
    inputs.info.email.value = user.email;
    inputs.info.email.valid = true;
    inputs.info.email.touched = true;

    if(user.dateOfBirth.length > 0) {
      let splitDate = user.dateOfBirth.split(".");
      inputs.info.birthDay.value = splitDate[0];
      inputs.info.birthDay.touched = true;
      inputs.info.birthMonth.value = months[parseInt(splitDate[1]) - 1];
      inputs.info.birthMonth.touched = true;
      inputs.info.birthYear.value = splitDate[2];
      inputs.info.birthYear.touched = true;
    }

    for(const input in inputs.info) {
      if(input.toLowerCase().includes("gender")) {
        if(input.toLowerCase().includes(user.gender.toLowerCase())) {
          inputs.info[input].attributes.checked = true;
        } else {
          inputs.info[input].attributes.checked = false;
        }
      }
    }
    onSetForm({
      inputs,
      formIsValid: true
    });
  };

  const onPrepareCSCForFormModal = useCallback(async(data: IHighSchool | ICurrentJob | IPreviousJob | ICurrentResidence | IPreviousResidence | ICollege | IEducationOther, form: IForm) => {
    let inputs = deepCloneInputs(form.inputs);
    let countries: {
      name: string;
      code: string;
    }[] | undefined = [];

    if(data.country && data.country.trim().length > 0) {
      countries = await onGetCountries();
      inputs.info.country.value = data.country;
      inputs.info.country.valid = true;
      inputs.info.country.touched = true;

      if(data.country.trim().toLowerCase() === "united states") {
        const states = await onGetUSStates();
        inputs.info.state.disabled = false;
        if(states) {
          inputs.info.state.options = Array.from(new Set(states.map(state => state.name)));
        }

        if(data.state && data.state.trim().length > 0) {
          inputs.info.state.touched = true;
          inputs.info.state.value = data.state;
          const selectedState = states!.find(state => state.name.toLowerCase() === data.state.toLowerCase());
          if(selectedState) {
            let cities = await onGetUSStatesCities(selectedState.code);
            if(cities) {
              inputs.info.city.disabled = false;
              inputs.info.city.options = Array.from(new Set(cities));
            }
          }
        }
      } else {
        if(countries) {
          const selectedCountry = countries.find(ctr => ctr.name.toLowerCase() === data.country.toLowerCase());
          if(selectedCountry) {
            let cities = await onGetCitiesOfCountry(selectedCountry.code);
            if(cities) {
              inputs.info.city.options = Array.from(new Set(cities));
            }
          }
        }
        inputs.info.city.disabled = false;
      }

      if(data.city && data.city.trim().length > 0) {
        inputs.info.city.value = data.city;
        inputs.info.city.valid = true;
        inputs.info.city.touched = true;
      }
    }

    return inputs;
  }, [onGetCitiesOfCountry, onGetCountries, onGetUSStates, onGetUSStatesCities]);

  const onOpenFormModalForHighSchool = async(): Promise<void> => {
    let inputs = deepCloneInputs(addOrEditHighSchoolForm.inputs);
    let formIsValid = false;

    if(profile && profile.highSchool) {
      inputs = await onPrepareCSCForFormModal(profile.highSchool, addOrEditHighSchoolForm);
      if(profile.highSchool.name && profile.highSchool.name.trim().length > 0) {
        inputs.info.name.value = profile.highSchool.name;
        inputs.info.name.valid = true;
        inputs.info.name.touched = true;

        formIsValid = true;
      }

      if(profile.highSchool.city && profile.highSchool.city.trim().length > 0) {
        inputs.info.city.value = profile.highSchool.city;
        inputs.info.city.valid = true;
        inputs.info.city.touched = true;
      }

      if(profile.highSchool.status) {
        inputs.info.status.value = profile.highSchool.status;
        inputs.info.status.valid = true;
        inputs.info.status.touched = true;
      }

      if(profile.highSchool.graduateDate) {
        inputs.info.graduateDate.value = profile.highSchool.graduateDate.toString();
        inputs.info.graduateDate.valid = true;
        inputs.info.graduateDate.touched = true;
      }
    }
    setFormModalInfo({
      show: true,
      formTitle: "Editing High School Info",
      formType: "addOrEditHighSchool"
    });
    onSetForm({
      inputs,
      formIsValid
    });
  };

  const onOpenFormModalForCurrResidence = useCallback(async(): Promise<void> => {
    let inputs = deepCloneInputs(addOrEditCurrentResidenceForm.inputs);
    let formIsValid = false;

    if(profile && profile.currentResidence) {
      inputs = await onPrepareCSCForFormModal(profile.currentResidence, addOrEditCurrentResidenceForm);
      if(profile.currentResidence.country && profile.currentResidence.country.trim().length > 0) {
        formIsValid = true;
      }

      if(profile.currentResidence.from) {
        inputs.info.from.value = profile.currentResidence.from.toString();
        inputs.info.from.valid = true;
        inputs.info.from.touched = true;
      }
    }
    setFormModalInfo({
      show: true,
      formTitle: "Editing Residence Info",
      formType: "addOrEditCurrRes"
    });
    onSetForm({
      inputs,
      formIsValid
    });
  }, [onPrepareCSCForFormModal, onSetForm, profile]);

  const onOpenFormModalForEditingCurrentJob = useCallback(async(itemId: string): Promise<void> => {
    let inputs = deepCloneInputs(addOrEditCurrentJobForm.inputs);
    let formIsValid = false;

    const targetJob = profile!.jobs.find(job => job._id === itemId);
    if(!targetJob) {
      return;
    }

    inputs = await onPrepareCSCForFormModal(targetJob, addOrEditCurrentJobForm);

    if(targetJob.role) {
      inputs.info.role.value = targetJob.role;
      inputs.info.role.valid = true;
      inputs.info.role.touched = true;

      formIsValid = true;
    }

    if(targetJob.company) {
      inputs.info.company.value = targetJob.company;
      inputs.info.company.valid = true;
      inputs.info.company.touched = true;
    }

    if(targetJob.from) {
      inputs.info.from.value = targetJob.from.toString();
      inputs.info.from.valid = true;
      inputs.info.from.touched = true;
    }

    setFormModalInfo({
      show: true,
      formTitle: "Editing Current Job Info",
      formType: "editCurrJob",
      itemId
    });
    onSetForm({
      inputs,
      formIsValid
    });
  }, [onPrepareCSCForFormModal, onSetForm, profile]);

  const onOpenFormModalForEditingPreviousJob = useCallback(async(itemId: string): Promise<void> => {
    let inputs = deepCloneInputs(addOrEditPreviousJobForm.inputs);
    let formIsValid = false;

    const targetJob = profile!.previousJobs.find(job => job._id === itemId);
    if(!targetJob) {
      return;
    }

    inputs = await onPrepareCSCForFormModal(targetJob, addOrEditPreviousJobForm);

    if(targetJob.role) {
      inputs.info.role.value = targetJob.role;
      inputs.info.role.valid = true;
      inputs.info.role.touched = true;

      formIsValid = true;
    }

    if(targetJob.company) {
      inputs.info.company.value = targetJob.company;
      inputs.info.company.valid = true;
      inputs.info.company.touched = true;
    }

    if(targetJob.from) {
      inputs.info.from.value = targetJob.from.toString()
      inputs.info.from.valid = true;
      inputs.info.from.touched = true;
    }

    if(targetJob.to) {
      inputs.info.to.value = targetJob.to.toString();
      inputs.info.to.valid = true;
      inputs.info.to.touched = true;
    }

    setFormModalInfo({
      show: true,
      formTitle: "Editing Previous Job Info",
      formType: "editPrevJob",
      itemId
    });
    onSetForm({
      inputs,
      formIsValid
    });
  }, [onPrepareCSCForFormModal, onSetForm, profile]);

  const onOpenFormModalForEditingCollege = useCallback(async(itemId: string): Promise<void> => {
    let inputs = deepCloneInputs(addOrEditCollegeForm.inputs);
    let formIsValid = false;

    const targetCollege = profile!.colleges.find(coll => coll._id === itemId);
    if(!targetCollege) {
      return;
    }

    inputs = await onPrepareCSCForFormModal(targetCollege, addOrEditCollegeForm);

    if(targetCollege.name) {
      inputs.info.name.value = targetCollege.name;
      inputs.info.name.valid = true;
      inputs.info.name.touched = true;

      formIsValid = true;
    }

    if(targetCollege.graduateDate) {
      inputs.info.graduateDate.value = targetCollege.graduateDate.toString()
      inputs.info.graduateDate.valid = true;
      inputs.info.graduateDate.touched = true;
    }

    if(targetCollege.status) {
      inputs.info.status.value = targetCollege.status;
      inputs.info.status.valid = true;
      inputs.info.status.touched = true;
    }

    setFormModalInfo({
      show: true,
      formTitle: "Editing College Info",
      formType: "editCollege",
      itemId
    });
    onSetForm({
      inputs,
      formIsValid
    });
  }, [onPrepareCSCForFormModal, onSetForm, profile]);

  const onOpenFormModalForEditingEducation = useCallback(async(itemId: string): Promise<void> => {
    let inputs = deepCloneInputs(addOrEditEducationForm.inputs);
    let formIsValid = false;

    const targetEdu = profile!.educationOther.find(edu => edu._id === itemId);
    if(!targetEdu) {
      return;
    }

    inputs = await onPrepareCSCForFormModal(targetEdu, addOrEditEducationForm);

    if(targetEdu.name) {
      inputs.info.name.value = targetEdu.name;
      inputs.info.name.valid = true;
      inputs.info.name.touched = true;

      formIsValid = true;
    }

    if(targetEdu.graduateDate) {
      inputs.info.gratuateDate.value = targetEdu.graduateDate.toString()
      inputs.info.gratuateDate.valid = true;
      inputs.info.gratuateDate.touched = true;
    }

    if(targetEdu.status) {
      inputs.info.status.value = targetEdu.status;
      inputs.info.status.valid = true;
      inputs.info.status.touched = true;
    }

    setFormModalInfo({
      show: true,
      formTitle: "Editing Education Info",
      formType: "editEduOther",
      itemId
    });
    onSetForm({
      inputs,
      formIsValid
    });
  }, [onPrepareCSCForFormModal, onSetForm, profile]);

  const onOpenFormModalForEditingPreviousResidence = useCallback(async(itemId: string): Promise<void> => {
    let inputs = deepCloneInputs(addOrEditPreviousResidenceForm.inputs);
    let formIsValid = false;

    const targetRes = profile!.previousResidences.find(resid => resid._id === itemId);
    if(!targetRes) {
      return;
    }

    inputs = await onPrepareCSCForFormModal(targetRes, addOrEditPreviousResidenceForm);

    if(targetRes.country && targetRes.country.trim().length > 0) {
      formIsValid = true;
    }

    if(targetRes.from) {
      inputs.info.from.value = targetRes.from.toString()
      inputs.info.from.valid = true;
      inputs.info.from.touched = true;
    }

    if(targetRes.to) {
      inputs.info.to.value = targetRes.to.toString();
      inputs.info.to.valid = true;
      inputs.info.to.touched = true;
    }

    setFormModalInfo({
      show: true,
      formTitle: "Editing Previous Residence Info",
      formType: "editPrevRes",
      itemId
    });
    onSetForm({
      inputs,
      formIsValid
    });
  }, [onPrepareCSCForFormModal, onSetForm, profile]);

  const onOpenFormModalForAddingNewItem = (form: IForm, formType: IFormModalType, formTitle: string): void => {
    setFormModalInfo({
      show: true,
      formTitle,
      formType
    });

    onSetForm(form);
  };
  /////////////////////////////////////////////////////////////

  // ADDING INFO ASYNC CALLS
  const onAddCurrentJob = useCallback(async(): Promise<void> => {
    const sentData = {
      role: form.inputs.info.role.value,
      company: form.inputs.info.company.value,
      country: form.inputs.info.country.value,
      state: form.inputs.info.state.value,
      city: form.inputs.info.city.value,
      from: form.inputs.info.from.value
    };
    const token = localStorage.getItem("socNetAppToken");

    try {
      const {data} = await axiosProfile.post<{status: string; jobs: ICurrentJob[]}>("/currentJob", sentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyProfileInfo((prev: any) => {
        return {
          ...prev,
          jobs: data.jobs
        };
      });
    } catch(error) {
      setChangeDateErrorMsg((error as any).response.data.message);
    }
  }, [form.inputs, setMyProfileInfo]);

  const onAddPrevJob = useCallback(async(): Promise<void> => {
    const sentData = {
      role: form.inputs.info.role.value,
      company: form.inputs.info.company.value,
      country: form.inputs.info.country.value,
      state: form.inputs.info.state.value,
      city: form.inputs.info.city.value,
      from: form.inputs.info.from.value,
      to: form.inputs.info.to.value
    };
    const token = localStorage.getItem("socNetAppToken");

    try {
      const {data} = await axiosProfile.post<{status: string; previousJobs: IPreviousJob[]}>("/prevJob", sentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyProfileInfo((prev: any) => {
        return {
          ...prev,
          previousJobs: data.previousJobs
        };
      });
    } catch(error) {
      setChangeDateErrorMsg((error as any).response.data.message);
    }
  }, [form.inputs, setMyProfileInfo]);

  const onAddCollegeOrEducation = useCallback(async(infoType: "colleges" | "educationOther"): Promise<void> => {
    const sentData = {
      name: form.inputs.info.name.value,
      country: form.inputs.info.country.value,
      state: form.inputs.info.state.value,
      city: form.inputs.info.city.value,
      status: form.inputs.info.status.value,
      graduateDate: form.inputs.info.graduateDate.value
    };

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosProfile.post<{status: string; info: ICollege[] | IEducationOther[]}>(`/collegeOrEdu/${infoType}`, sentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMyProfileInfo((prev: any) => {
        return {
          ...prev,
          [infoType]: data.info
        };
      });
    } catch(error) {
      setChangeDateErrorMsg((error as any).response.data.message);
    }
  }, [form.inputs, setMyProfileInfo]);

  const onAddOrEditCurResidence = useCallback(async(): Promise<void> => {
    const sentData = {
      country: form.inputs.info.country.value,
      state: form.inputs.info.state.value,
      city: form.inputs.info.city.value,
      from: form.inputs.info.from.value
    };

    const token = localStorage.getItem("socNetAppToken");

    try {
      await axiosProfile.post("/curResidence", sentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMyProfileInfo((prev: any) => {
        return {
          ...prev,
          currentResidence: sentData
        };
      });
    } catch(error) {
      setChangeDateErrorMsg((error as any).response.data.message);
    }
  }, [form.inputs, setMyProfileInfo]);

  const onAddPrevResidence = useCallback(async(): Promise<void> => {
    const sentData = {
      country: form.inputs.info.country.value,
      state: form.inputs.info.state.value,
      city: form.inputs.info.city.value,
      from: form.inputs.info.from.value,
      to: form.inputs.info.to.value
    };

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosProfile.post<{status: string; previousResidences: IPreviousResidence[]}>("/prevResidences", sentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMyProfileInfo((prev: any) => {
        return {
          ...prev,
          previousResidences: data.previousResidences
        };
      });
    } catch(error) {
      setChangeDateErrorMsg((error as any).response.data.message);
    }
  }, [form.inputs, setMyProfileInfo]);

  /////////////////////////////////////////////////////////////

  // EDITING INFO ASYNC CALLS
  const onEditAuthData = useCallback(async(): Promise<void> => {
    let selectedGender: "male" | "female" | "unset" = "unset";
    if(form.inputs.info.genderMale.attributes.checked) {
      selectedGender = "male";
    } else if(form.inputs.info.genderFemale.attributes.checked) {
      selectedGender = "female";
    }

    const data = {
      firstName: form.inputs.info.firstName.value,
      lastName: form.inputs.info.lastName.value,
      email: form.inputs.info.email.value,
      gender: selectedGender,
      birthDay: form.inputs.info.birthDay.value,
      birthMonth: form.inputs.info.birthMonth.value,
      birthYear: form.inputs.info.birthYear.value
    };

    dispatch(editUserData(data));
  }, [dispatch, form.inputs]);

  const onEditHighSchool = useCallback(async(): Promise<void> => {
    const data = {
      name: form.inputs.info.name.value,
      country: form.inputs.info.country.value,
      state: form.inputs.info.state.value,
      city: form.inputs.info.city.value,
      status: form.inputs.info.status.value,
      graduateDate: form.inputs.info.graduateDate.value.toString()
    };
    const token = localStorage.getItem("socNetAppToken");
    
    try {
      await axiosProfile.post("/highSchool", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyProfileInfo((prev: any) => {
        if(prev === null) return prev;
        return {
          ...prev,
          highSchool: {...data}
        }
      });
    } catch(error) {
      setChangeDateErrorMsg((error as any).response.data.message);
    }
  }, [form.inputs, setMyProfileInfo]);

  const onEditCurrentJob = useCallback(async(): Promise<void> => {
    if(formModalInfo.itemId) {
      const sentData = {
        id: formModalInfo.itemId,
        role: form.inputs.info.role.value,
        company: form.inputs.info.company.value,
        country: form.inputs.info.country.value,
        state: form.inputs.info.state.value,
        city: form.inputs.info.city.value,
        from: form.inputs.info.from.value
      };

      const token = localStorage.getItem("socNetAppToken");

      try {
        const { data } = await axiosProfile.patch<{status: string; editedJob: ICurrentJob}>("/currentJob", sentData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMyProfileInfo((prev: any) => {
          if(prev === null) return prev;
          let copiedJobs = [...prev.jobs];
          let targetJobIndex = copiedJobs.findIndex(job => job._id === formModalInfo.itemId);
          copiedJobs[targetJobIndex] = data.editedJob;

          return {
            ...prev,
            jobs: copiedJobs
          };
        });
      } catch(error) {
        setChangeDateErrorMsg((error as any).response.data.message);
      }
    } 
  }, [form.inputs, formModalInfo.itemId, setMyProfileInfo]);

  const onEditPreviousJob = useCallback(async(): Promise<void> => {
    if(formModalInfo.itemId) {
      const sentData = {
        id: formModalInfo.itemId,
        role: form.inputs.info.role.value,
        company: form.inputs.info.company.value,
        country: form.inputs.info.country.value,
        state: form.inputs.info.state.value,
        city: form.inputs.info.city.value,
        from: form.inputs.info.from.value,
        to: form.inputs.info.to.value
      };

      const token = localStorage.getItem("socNetAppToken");

      try {
        const { data } = await axiosProfile.patch<{status: string; editedJob: IPreviousJob}>("/prevJob", sentData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMyProfileInfo((prev: any) => {
          if(prev === null) return prev;
          let copiedJobs = [...prev.previousJobs];
          let targetJobIndex = copiedJobs.findIndex(job => job._id === formModalInfo.itemId);
          copiedJobs[targetJobIndex] = data.editedJob;

          return {
            ...prev,
            previousJobs: copiedJobs
          };
        });
      } catch(error) {
        setChangeDateErrorMsg((error as any).response.data.message);
      }
    } 
  }, [form.inputs, formModalInfo.itemId, setMyProfileInfo]);

  const onEditCollege = useCallback(async(): Promise<void> => {
    if(formModalInfo.itemId) {
      const sentData = {
        id: formModalInfo.itemId,
        name: form.inputs.info.name.value,
        country: form.inputs.info.country.value,
        state: form.inputs.info.state.value,
        city: form.inputs.info.city.value,
        status: form.inputs.info.status.value,
        graduateDate: form.inputs.info.graduateDate.value,
      };

      const token = localStorage.getItem("socNetAppToken");

      try {
        const { data } = await axiosProfile.patch<{status: string; editedItem: ICollege}>("/collegeOrEdu/colleges", sentData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMyProfileInfo((prev: any) => {
          if(prev === null) return prev;
          let copiedColleges = [...prev.colleges];
          let targetCollegeIndex = copiedColleges.findIndex(coll => coll._id === formModalInfo.itemId);
          copiedColleges[targetCollegeIndex] = data.editedItem;

          return {
            ...prev,
            colleges: copiedColleges
          };
        });
      } catch(error) {
        setChangeDateErrorMsg((error as any).response.data.message);
      }
    } 
  }, [form.inputs, formModalInfo.itemId, setMyProfileInfo]);

  const onEditEducationOther = useCallback(async(): Promise<void> => {
    if(formModalInfo.itemId) {
      const sentData = {
        id: formModalInfo.itemId,
        name: form.inputs.info.name.value,
        country: form.inputs.info.country.value,
        state: form.inputs.info.state.value,
        city: form.inputs.info.city.value,
        status: form.inputs.info.status.value,
        graduateDate: form.inputs.info.graduateDate.value,
      };

      const token = localStorage.getItem("socNetAppToken");

      try {
        const { data } = await axiosProfile.patch<{status: string; editedItem: IEducationOther}>("/collegeOrEdu/educationOther", sentData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMyProfileInfo((prev: any) => {
          if(prev === null) return prev;
          let copiedEdu = [...prev.educationOther];
          let targetEduIndex = copiedEdu.findIndex(edu => edu._id === formModalInfo.itemId);
          copiedEdu[targetEduIndex] = data.editedItem;

          return {
            ...prev,
            educationOther: copiedEdu
          };
        });
      } catch(error) {
        setChangeDateErrorMsg((error as any).response.data.message);
      }
    } 
  }, [form.inputs, formModalInfo.itemId, setMyProfileInfo]);

  const onEditEPreviousResidence = useCallback(async(): Promise<void> => {
    if(formModalInfo.itemId) {
      const sentData = {
        id: formModalInfo.itemId,
        country: form.inputs.info.country.value,
        state: form.inputs.info.state.value,
        city: form.inputs.info.city.value,
        from: form.inputs.info.from.value,
        to: form.inputs.info.to.value,
      };

      const token = localStorage.getItem("socNetAppToken");

      try {
        const { data } = await axiosProfile.patch<{status: string; editedResidence: IPreviousResidence}>("/prevResidences", sentData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMyProfileInfo((prev: any) => {
          if(prev === null) return prev;
          let copiedPrevRes = [...prev.previousResidences];
          let targetPrevResIndex = copiedPrevRes.findIndex(resid => resid._id === formModalInfo.itemId);
          copiedPrevRes[targetPrevResIndex] = data.editedResidence;

          return {
            ...prev,
            previousResidences: copiedPrevRes
          };
        });
      } catch(error) {
        setChangeDateErrorMsg((error as any).response.data.message);
      }
    } 
  }, [form.inputs, formModalInfo.itemId, setMyProfileInfo]);

  const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(async(event): Promise<void> => {
    event.preventDefault();
    setChangeDataLoading(true);

    if(formModalInfo.formType === "editInfo") {
      await onEditAuthData();
    } else if(formModalInfo.formType === "addOrEditHighSchool") {
      await onEditHighSchool();
    } else if(formModalInfo.formType === "addCurrJob") {
      await onAddCurrentJob();
    } else if(formModalInfo.formType === "addPrevJob") {
      await onAddPrevJob();
    } else if(formModalInfo.formType === "addCollege") {
      await onAddCollegeOrEducation("colleges");
    } else if(formModalInfo.formType === "addEduOther") {
      await onAddCollegeOrEducation("educationOther");
    } else if(formModalInfo.formType === "addPrevRes") {
      await onAddPrevResidence();
    } else if(formModalInfo.formType === "addOrEditCurrRes") {
      await onAddOrEditCurResidence();
    } else if(formModalInfo.formType === "editCurrJob") {
      await onEditCurrentJob();
    } else if(formModalInfo.formType === "editPrevJob") {
      await onEditPreviousJob();
    } else if(formModalInfo.formType === "editCollege") {
      await onEditCollege();
    } else if(formModalInfo.formType === "editEduOther") {
      await onEditEducationOther();
    } else if(formModalInfo.formType === "editPrevRes") {
      await onEditEPreviousResidence();
    }

    onFormModalClose();
    setChangeDataLoading(false);
  }, [formModalInfo.formType, onEditAuthData, onEditHighSchool, onAddCurrentJob, onAddPrevJob, onAddCollegeOrEducation, onAddPrevResidence, onAddOrEditCurResidence, onEditCurrentJob, onEditPreviousJob, onEditCollege, onEditEducationOther, onEditEPreviousResidence]);

  if(loading) return <Spinner />;

  return (
    <>
      {deleteModalInfo.itemType && (
        <DefaultModal
          loading={changeDataLoading}
          show={deleteModalInfo.itemType !== null}
          isErrorModal={false}
          title={deleteModalInfo.title}
          text={deleteModalInfo.text}
          onClose={onDeleteModalClose}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__cancel"
            btnText="cancel"
            onClick={onDeleteModalClose} />
          <ModalBtn
            btnType="submit"
            btnCustomType="btn__confirm"
            btnText="delete"
            onClick={onDeleteSingleInfoItem} />
        </DefaultModal>
      )}
      {changeDataErrorMsg && (
        <DefaultModal
          show={changeDataErrorMsg !== null}
          isErrorModal={true}
          title="Error occured"
          text={changeDataErrorMsg}
          onClose={onClearErrorMsg}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__ok"
            btnText="ok"
            onClick={onClearErrorMsg} />
        </DefaultModal>
      )}
      {formModalInfo.show && formModalInfo.formType && (
        <FormModal
          loading={changeDataLoading}
          title={formModalInfo.formTitle}
          show={formModalInfo.show}
          form={form}
          submiBtnDisabled={form.formIsValid}
          onClose={onFormModalClose}
          onInputFocus={onInputFocus}
          onCountryInputFocus={onCountryInputFocus}
          onInpuUnfocus={onInputUnfocus}
          onInputChange={onInputChange}
          onSelectInputChange={onSelectInputChange}
          onRadioInputChange={onRadioInputChange}
          onSubmit={onFormSubmit} />
      )}
      <div className={styles.info}>
        {
          !profile || (profile && Object.keys(profile).length === 0)
          ? <p className={styles.info__no_profile}>Data not available</p>
          : (
            <div className={styles.info__content}>
              <div className={styles.info__top}>
                <div className={`${styles.info__box} ${styles.info__box_basic}`}>
                  <div className={styles.info__box_title}>
                    <h4>Basic Info</h4>
                    {isAuthUser && (
                      <button 
                        type="button" 
                        className={styles.info__box_btn}
                        onClick={onOpenModalForAuthData}>
                        edit
                      </button>
                    )}
                  </div>
                  <div className={styles.info__box_data}>
                    <div className={styles.info__box_data_item}>
                      <p className={styles.info__box_data_item_value}>
                        <span className={styles.key}>Full Name: </span><span className={styles.value}>{user.fullName}</span>
                      </p>
                    </div>
                    <div className={styles.info__box_data_item}>
                      <p className={styles.info__box_data_item_value}>
                        <span className={styles.key}>Email: </span><span className={styles.value}>{user.email}</span>
                      </p>
                    </div>
                    <div className={styles.info__box_data_item}>
                      <p className={styles.info__box_data_item_value}>
                        <span className={styles.key}>Birthday: </span><span className={styles.value}>{user.dateOfBirth || "No data"}</span>
                      </p>
                    </div>
                    <div className={styles.info__box_data_item}>
                      <p className={styles.info__box_data_item_value}>
                        <span className={styles.key}>Gender: </span><span className={styles.value}>{user.gender}</span>
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
                        {isAuthUser && (
                          <button 
                            type="button" 
                            className={styles.info__box_btn}
                            onClick={() => onOpenFormModalForAddingNewItem(addOrEditCurrentJobForm, "addCurrJob", "Adding New Job")}>
                            add new
                          </button>
                        )}
                      </div>
                      <div className={styles.items}>
                        {
                          profile.jobs.length === 0 || (profile.jobs.length > 0 && profile.jobs.every(job => !job.role))
                          ? <p className={styles.no_info}>No Info</p>
                          : profile.jobs.map(job => {
                            return (
                              <ProfileInfoSingleJob
                                key={job._id}
                                jobType="current"
                                job={job}
                                isAuthUser={isAuthUser}
                                onPrepareEditProfileInfoItem={onOpenFormModalForEditingCurrentJob}
                                onPrepareDeleteProfileInfoItem={onPrepareDeleteProfileInfoItem} />
                            );
                          })
                        }
                      </div>
                    </div>
                    <div className={`${styles.info__box_dataflex_subbox} ${styles.info__box_dataflex_subbox__stretch}`}>
                      <div className={styles.title}>
                        <h4>Previous Jobs</h4>
                        {isAuthUser && (
                          <button 
                            type="button" 
                            className={styles.info__box_btn}
                            onClick={() => onOpenFormModalForAddingNewItem(addOrEditPreviousJobForm, "addPrevJob", "Adding Previous Job")}>
                            add new
                          </button>
                        )}
                      </div>
                      <div className={styles.items}>
                        {
                          profile.previousJobs.length === 0 || (profile.previousJobs.length > 0 && profile.previousJobs.every(job => !job.role))
                          ? <p className={styles.no_info}>No Info</p>
                          : profile.previousJobs.map(job => {
                            return (
                              <ProfileInfoSingleJob
                                key={job._id}
                                jobType="previous"
                                job={job}
                                isAuthUser={isAuthUser}
                                onPrepareEditProfileInfoItem={onOpenFormModalForEditingPreviousJob}
                                onPrepareDeleteProfileInfoItem={onPrepareDeleteProfileInfoItem} />
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
                        {isAuthUser && (
                          <button 
                            type="button" 
                            className={styles.info__box_btn}
                            onClick={onOpenFormModalForHighSchool}>
                            {!profile.highSchool || (profile.highSchool && !profile.highSchool.name) ? "add" : "edit"}
                          </button>
                        )}
                      </div>
                      <div className={styles.items}>
                        {
                          !profile.highSchool || (profile.highSchool && !profile.highSchool.name)
                          ? <p className={styles.no_info}>No Info</p>
                          : (
                            <div className={styles.item}>
                              <p className={styles.item__info}>{profile.highSchool.status === "finished" ? "Graduated " : "Goes to "} <span>{profile.highSchool.name}</span> {profile.highSchool.country ? "in" : ""} {profile.highSchool.country ? <span>{profile.highSchool.country}</span> : ""} {profile.highSchool.state ? <span>/{profile.highSchool.state}</span> : ""} {profile.highSchool.city ? <span>/{profile.highSchool.city}</span> : ""} {profile.highSchool.status === "finished" && profile.highSchool.graduateDate ? "on" : ""} {profile.highSchool.status === "finished" && profile.highSchool.graduateDate ? <span>{formatDateToYearMonthAndDay(profile.highSchool.graduateDate)}</span> : ""}</p>
                              <IconBtn
                                color="btn__red"
                                text="delete info"
                                icon={<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path></svg>}
                                onClick={() => onPrepareDeleteProfileInfoItem(null, "highSchool", "Prepairing to delete high school info", "Are you sure you want to delete high school info?")} />
                            </div>
                          )
                        }
                      </div>
                    </div>
                    <div className={`${styles.info__box_dataflex_subbox} ${styles.info__box_dataflex_subbox__stretch}`}>
                      <div className={styles.title}>
                        <h4>Colleges</h4>
                        {isAuthUser && (
                          <button 
                            type="button" 
                            className={styles.info__box_btn}
                            onClick={() => onOpenFormModalForAddingNewItem(addOrEditCollegeForm, "addCollege", "Adding College")}>
                            add new
                          </button>
                        )}
                      </div>
                      <div className={styles.items}>
                        {
                          profile.colleges.length === 0 || (profile.colleges.length > 0 && profile.colleges.every(coll => !coll.name))
                          ? <p className={styles.no_info}>No Info</p>
                          : profile.colleges.map(coll => {
                            return (
                              <ProfileInfoSingleEducation
                                key={coll._id}
                                education={coll}
                                eduType="college"
                                isAuthUser={isAuthUser}
                                onPrepareEditProfileInfoItem={onOpenFormModalForEditingCollege}
                                onPrepareDeleteProfileInfoItem={onPrepareDeleteProfileInfoItem} />
                            );
                          })
                        }
                      </div>
                    </div>
                    <div className={`${styles.info__box_dataflex_subbox} ${styles.info__box_dataflex_subbox__stretch}`}>
                      <div className={styles.title}>
                        <h4>Other</h4>
                        {isAuthUser && (
                          <button 
                            type="button" 
                            className={styles.info__box_btn}
                            onClick={() => onOpenFormModalForAddingNewItem(addOrEditEducationForm, "addEduOther", "Adding Education")}>
                            add new
                          </button>
                        )}
                      </div>
                      <div className={styles.items}>
                        {
                          profile.educationOther.length === 0 || (profile.educationOther.length > 0 && profile.educationOther.every(ed => !ed.name))
                          ? <p className={styles.no_info}>No Info</p>
                          : profile.educationOther.map(edu => {
                            return (
                              <ProfileInfoSingleEducation
                                key={edu._id}
                                education={edu}
                                eduType="education"
                                isAuthUser={isAuthUser}
                                onPrepareEditProfileInfoItem={onOpenFormModalForEditingEducation}
                                onPrepareDeleteProfileInfoItem={onPrepareDeleteProfileInfoItem} />
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
                        {isAuthUser && (
                          <button 
                            type="button" 
                            className={styles.info__box_btn}
                            onClick={onOpenFormModalForCurrResidence}>
                            {!profile.currentResidence || (profile.currentResidence && !profile.currentResidence.country) ? "add" : "edit"}
                          </button>
                        )}
                      </div>
                      <div className={styles.items}>
                        {
                          !profile.currentResidence || (profile.currentResidence && !profile.currentResidence.country)
                          ? <p className={styles.no_info}>No Info</p>
                          : (
                            <ProfileInfoSingleResidence
                              residenceType="current"
                              residence={profile.currentResidence}
                              isAuthUser={isAuthUser}
                              onPrepareDeleteProfileInfoItem={onPrepareDeleteProfileInfoItem} />
                          )
                        }
                      </div>
                    </div>
                    <div className={`${styles.info__box_dataflex_subbox} ${styles.info__box_dataflex_subbox__stretch}`}>
                      <div className={styles.title}>
                        <h4>Previous</h4>
                        {isAuthUser && (
                          <button 
                            type="button" 
                            className={styles.info__box_btn}
                            onClick={() => onOpenFormModalForAddingNewItem(addOrEditPreviousResidenceForm, "addPrevRes", "Adding Previous Residence")}>
                            add new
                          </button>
                        )}
                      </div>
                      <div className={styles.items}>
                        {
                          profile.previousResidences.length === 0 || (profile.previousResidences.length > 0 && profile.previousResidences.every(resid => !resid.country))
                          ? <p className={styles.no_info}>No Info</p>
                          : profile.previousResidences.map(resid => {
                            return (
                              <ProfileInfoSingleResidence
                                key={resid._id}
                                residenceType="previous"
                                residence={resid}
                                isAuthUser={isAuthUser}
                                onPrepareEditProfileInfoItem={onOpenFormModalForEditingPreviousResidence}
                                onPrepareDeleteProfileInfoItem={onPrepareDeleteProfileInfoItem} />
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
    </>
  );
};

export default ProfileInfoMe;