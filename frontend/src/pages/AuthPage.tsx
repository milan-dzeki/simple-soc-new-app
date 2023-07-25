import { FC, lazy, useEffect, useCallback } from 'react';
// hooks
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// components
import AuthHeader from '../components/Headers/AuthHeader';
import AuthForm from '../components/Forms/AuthForm';
import AuthUsers from '../components/AuthPage/AuthUsers';
import ModalBtn from '../components/Buttons/ModalBtn';
// redux
import { onClearAuthError } from '../store/actions/authActions';

const DefaultModal = lazy(() => import("../components/Modals/DefaultModal"));

const AuthPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { initLoading, authLoading, authErrorMsg, token, authUser } = useTypedSelector(state => state.auth);

  useEffect(() => {
    if(!initLoading && !authLoading && !authErrorMsg && token && authUser) {
      navigate("/", { replace: true });
    }
  }, [initLoading, authLoading, authErrorMsg, token, authUser, navigate]);

  const onClearError = useCallback((): void => {
    dispatch(onClearAuthError());
  }, [dispatch]);

  return (
    <>
      {authErrorMsg && (
        <DefaultModal
          show={authErrorMsg !== null}
          isErrorModal={true}
          title="Error occured"
          text={authErrorMsg}
          onClose={onClearError}>
          <ModalBtn
            btnType="button"
            btnCustomType="btn__ok"
            btnText="OK"
            onClick={onClearError} />
        </DefaultModal>
      )}
      <AuthHeader />
      <main>
        <AuthUsers />
        <AuthForm loading={authLoading} />
      </main>
    </>
  );
};

export default AuthPage;