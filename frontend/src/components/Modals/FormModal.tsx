import { FC, FormEventHandler, ChangeEvent, memo } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/components/modals/formModal.module.scss';
import { IForm } from '../../types/formsAndInputs/form';
import Backdrop from '../Shared/Backdrop';
import InputRenderer from '../Inputs/InputRenderer';
import ModalBtn from '../Buttons/ModalBtn';
import Spinner from '../Shared/Spinner';
import ModalTitle from './ModalTitle';

interface Props {
  loading: boolean;
  show: boolean;
  form: IForm;
  submiBtnDisabled?: boolean;
  title: string;
  onClose: () => void;
  onInputFocus: (inputGroup: string, inputName: string) => void;
  onCountryInputFocus?: (inputGroup: string, inputName: string) => Promise<void>;
  onInpuUnfocus: (inputGroup: string, inputName: string) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onSelectInputChange: (inputGroup: string, inputName: string, inputValue: string) => Promise<void>;
  onRadioInputChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const FormModal: FC<Props> = (props) => {
  return ReactDOM.createPortal(
    <>
      <Backdrop
        show={props.show}
        bcgColor="dark"
        onClose={props.onClose} />
      <div className={styles.form}>
        <ModalTitle
          text={props.title}
          loading={props.loading || false}
          onClose={props.onClose} />
        <form className={styles.form__form} onSubmit={props.onSubmit}>
          {
            props.loading
            ? <Spinner />
            : (
                <>
                  <div className={styles.form__inputs}>
                    <InputRenderer
                      groupTitleShow={false}
                      groupsPosition="block"
                      hasBorderBottom={false}
                      inputs={props.form.inputs}
                      onInputFocus={props.onInputFocus}
                      onCountryInputFocus={props.onCountryInputFocus}
                      onInputUnfocus={props.onInpuUnfocus}
                      onInputChange={props.onInputChange}
                      onSelectInputChange={props.onSelectInputChange}
                      onRadioInputChange={props.onRadioInputChange} />
                  </div>
                  <div className={styles.form__btns}>
                    <ModalBtn
                      btnType="button"
                      btnCustomType="btn__cancel"
                      btnText="cancel"
                      onClick={props.onClose} />
                    <ModalBtn
                      btnType="submit"
                      btnCustomType="btn__confirm"
                      btnText="submit"
                      disabled={!props.submiBtnDisabled} />
                  </div>
                </>
              )
          }
        </form>
      </div>
    </>,
    document.getElementById("modal") as HTMLDivElement
  )
};

export default memo(FormModal);