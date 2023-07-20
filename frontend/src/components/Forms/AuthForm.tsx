import { FC, ChangeEvent, FormEventHandler, useState, useCallback } from 'react';
import styles from '../../styles/components/forms/authForm.module.scss';
// config
import { signupForm } from '../../config/authPage/signupForm';
import { loginForm } from '../../config/authPage/loginForm';
// hooks
import { useForm } from '../../hooks/useFormHook/useForm';
import { useDispatch } from 'react-redux';
// types
import { IAuthPhotoInput } from '../../types/authPage/authPhotoInputState';
import { IAuthPageState, IFormTitles, IFormTitle, IFormSwitchBtnTexts, IFormSwitchBtnText, IFormSwitchTexts, IFormSwitchText } from '../../types/authPage/state';
// components
import FormTitle from './FormTitle';
import InputRenderer from '../Inputs/InputRenderer';
import PhotoInput from '../Inputs/PhotoInput';
import Spinner from '../Shared/Spinner';
// redux
import { signup, login } from '../../store/actions/authActions';

interface Props {
  loading: boolean;
}

const AuthForm: FC<Props> = (props) => {
  const dispatch = useDispatch();

  const [state, setState] = useState<IAuthPageState>({
    formTitle: IFormTitles.SIGNUP,
    formSubmitBtnText: IFormTitles.SIGNUP,
    formSwitchText: IFormSwitchTexts.HAVE_ACCOUNT,
    formSwitchBtnText: IFormSwitchBtnTexts.SWITCH_TO_LOGIN
  });

  const {
    form,
    onSetForm,
    onInputFocus,
    onInputUnfocus,
    onInputChange,
    onSelectInputChange,
    onRadioInputChange,
    onTogglePasswordInputVisibility
  } = useForm(signupForm);

  const [profilePhotoInput, setProfilePhotoInput] = useState<IAuthPhotoInput>({
    photoFile: null,
    photoPreview: ""
  });

  const onSwitchForms = useCallback((): void => {
    let formTitle: IFormTitle = IFormTitles.SIGNUP;
    let formSubmitBtnText: IFormTitle = IFormTitles.SIGNUP;
    let formSwitchText: IFormSwitchText = IFormSwitchTexts.HAVE_ACCOUNT;
    let formSwitchBtnText: IFormSwitchBtnText = IFormSwitchBtnTexts.SWITCH_TO_LOGIN;
    let setupForm = signupForm;

    if(state.formTitle === IFormTitles.SIGNUP) {
      formTitle = IFormTitles.LOGIN;
      formSubmitBtnText = IFormTitles.LOGIN;
      formSwitchText = IFormSwitchTexts.NO_ACCOUNT;
      formSwitchBtnText = IFormSwitchBtnTexts.SWITCH_TO_SIGNUP;
      setupForm = loginForm;
    } 

    setState({
      formTitle,
      formSubmitBtnText,
      formSwitchBtnText,
      formSwitchText
    });

    onSetForm(setupForm);
  }, [onSetForm, state.formTitle]);

  const onPrepareProfilePhoto = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    if(target.files && target.files.length > 0) {
      setProfilePhotoInput({
        photoFile: target.files[0],
        photoPreview: URL.createObjectURL(target.files[0])
      });
    } else return;
  }, []);

  const onRemoveProfilePhoto = useCallback((): void => {
    setProfilePhotoInput({
      photoFile: null,
      photoPreview: ""
    });
  }, []);

  const onSignup = (): void => {
    const formData = new FormData();

    for(const group in form.inputs) {
      for(const input in form.inputs[group]) {
        if(!input.toLowerCase().includes("gender")) {
          formData.append(input, form.inputs[group][input].value);
        }
        if(input.toLowerCase().includes("gender") && form.inputs[group][input].attributes.checked) {
          formData.append("gender", form.inputs[group][input].value);
        }
      }
    }

    dispatch(signup(formData));
  };

  const onLogin = (): void => {
    const providedData = {
      email: form.inputs.authentication_credentials.email.value,
      password: form.inputs.authentication_credentials.password.value
    };

    dispatch(login(providedData));
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    if(state.formTitle === IFormTitles.SIGNUP) {
      onSignup();
    } else {
      onLogin();
    }
  };

  if(props.loading) return <Spinner />;

  return (
    <section className={`${styles.form} ${state.formTitle === IFormTitles.LOGIN ? styles.form__small :""}`}>
      <FormTitle
        hasCloseBtn={false}
        text={state.formTitle}
        textAlign="center" />
      <form className={styles.form__form} onSubmit={onFormSubmit}>
        <div className={styles.form__inputs}>
          <InputRenderer
            groupTitleShow={true}
            groupsPosition="flex"
            hasBorderBottom={false}
            inputs={form.inputs}
            onInputFocus={onInputFocus}
            onInputUnfocus={onInputUnfocus}
            onInputChange={onInputChange}
            onSelectInputChange={onSelectInputChange}
            onRadioInputChange={onRadioInputChange}
            onTogglePasswordInputVisibility={onTogglePasswordInputVisibility} />
          {
            state.formTitle === IFormTitles.SIGNUP && (
              <PhotoInput
                photoFile={profilePhotoInput.photoFile}
                photoPreview={profilePhotoInput.photoPreview}
                inputText="Upload profile photo"
                onPrepareProfilePhoto={onPrepareProfilePhoto}
                onRemoveProfilePhoto={onRemoveProfilePhoto} />
            )
          }
        </div>
        <button
          type="submit"
          className={styles.form__btn}
          disabled={!form.formIsValid}>
          {state.formSubmitBtnText}
        </button>
        <p className={styles.form__switch_text}>
          {state.formSwitchText}
        </p>
        <button
          type="button"
          className={styles.form__switch_btn}
          onClick={onSwitchForms}>
          {state.formSwitchBtnText}
        </button>
      </form>
    </section>
  );
};

export default AuthForm;