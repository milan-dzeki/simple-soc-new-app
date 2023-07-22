import { FC } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useTypedSelector } from './hooks/useTypedSelector';
import { useLocation } from 'react-router-dom';
import MainHeader from './components/Headers/MainHeader';

const ProtectedRoutes: FC = () => {
  const { pathname } = useLocation();
  const { initLoading, authLoading, token, authUser } = useTypedSelector(state => state.auth);
  const { unreadNotificationsCount } = useTypedSelector(state => state.notifications);
  const { unreadChatsCount } = useTypedSelector(state => state.chats);

  if(!initLoading && !authLoading && (!token && !authUser) && pathname !== "/info") {
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