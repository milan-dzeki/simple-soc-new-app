import { FC } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useTypedSelector } from './hooks/useTypedSelector';
import MainHeader from './components/Headers/MainHeader';

const ProtectedRoutes: FC = () => {
  const { initLoading, authLoading, token, authUser } = useTypedSelector(state => state.auth);
  const { unreadNotificationsCount } = useTypedSelector(state => state.notifications);
  const { unreadChatsCount } = useTypedSelector(state => state.chats);

  if(!initLoading && !authLoading && (!token && !authUser)) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      {token && authUser && <MainHeader user={authUser} unreadNotificationsCount={unreadNotificationsCount} unreadChatsCount={unreadChatsCount} />}
      <Outlet />
    </>
  );
};

export default ProtectedRoutes;