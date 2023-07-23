import { FC, lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import socket from './socketIo';
// hooks
import { useDispatch } from 'react-redux';
import { useTypedSelector } from './hooks/useTypedSelector';
import { useLocation } from 'react-router-dom';
// redux
import { isLoggedIn } from './store/actions/authActions';
import { friendRequestAccepted, friendRequestWithdrawn, getFriends, unfriended } from './store/actions/friendsActions';
// components
import ProtectedRoutes from './ProtectedRoutes';
import Spinner from './components/Shared/Spinner';
// pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
// redux
import { getActiveUsers } from './store/actions/activeUsersActions';
import { getUnreadNotifsCount, receiveLiveNotification } from './store/actions/notificationsActions';
import { getUnreadChatsCount, receiveMessageWhileNotOnChatsPageSuccess } from './store/actions/chatsActions';
import { receiveFriendRequest } from './store/actions/friendsActions';

const MyProfilePage = lazy(() => import("./pages/MyProfilePage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ActivityLogsPage = lazy(() => import("./pages/ActivityLogsPage"));
const ChatsPage = lazy(() => import("./pages/ChatsPage"));
const SinglePostPage = lazy(() => import("./pages/SinglePostPage"));
const SinglePhotoPage = lazy(() => import("./pages/SinglePhotoPage"));
const SearchUsers = lazy(() => import("./pages/SearchUsers"));
const AppInfoPage = lazy(() => import("./pages/AppInfo"));

const App: FC = () => {
  const dispatch = useDispatch();
  const {pathname} = useLocation();
  const { token } = useTypedSelector(state => state.auth);

  useEffect(() => {
    dispatch(isLoggedIn());
  }, [dispatch]);

  useEffect(() => {
    if(token) {
      dispatch(getFriends());
      dispatch(getUnreadNotifsCount());
      dispatch(getUnreadChatsCount());
    }
  }, [token, dispatch]);

  const handleBeforeUnload = (event: any) => {
    // Clear the reconnect timeout if it's set
    // clearTimeout(reconnectTimeout);

    // Attempt intentional disconnection before the page is closed or refreshed
    // setIntentionalDisconnect(true);
    socket.disconnect(); // Optionally, you can also perform any other cleanup here

    // Show a confirmation prompt to the user (browser-specific behavior)
    event.preventDefault();
    event.returnValue = ""; // Some browsers require a return value to display a prompt
  };

  useEffect(() => {
    let reconnectionTimeOut: any;

    socket.on("connect", () => {
      socket.on("getActiveUsers", ({activeUsers}) => {
          dispatch(getActiveUsers(activeUsers));
        });
    });

    socket.on("disconnect", () => {
      reconnectionTimeOut = setTimeout(() => {
        socket.connect();
      }, 5000);
    });

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("disconnect");
      clearTimeout(reconnectionTimeOut);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  useEffect(() => {
    socket.on("getActiveUsers", ({activeUsers}) => {
      dispatch(getActiveUsers(activeUsers));
    });

    socket.on("receiveNotification", ({notification}) => {
      dispatch(receiveLiveNotification(notification));
    });

    socket.on("receiveFriendRequest", ({notification, user}) => {
      dispatch(receiveLiveNotification(notification));
      dispatch(receiveFriendRequest(user));
    });

    socket.on("friendRequestWithdrawn", ({userId}) => {
      dispatch(friendRequestWithdrawn(userId));
    });

    socket.on("friendRequestAccepted", ({notification, user}) => {
      dispatch(receiveLiveNotification(notification));
      dispatch(friendRequestAccepted(user));
    });

    socket.on("unfriended", ({userId}) => {
      dispatch(unfriended(userId));
    });

    return () => {
      socket.off("getActiveUsers");
      socket.off("receiveNotification");
      socket.off("receiveFriendRequest");
      socket.off("friendRequestWithdrawn");
      socket.off("friendRequestAccepted");
    };
  }, [dispatch]);

  useEffect(() => {
    socket.on("receiveMessage", ({chatId}) => {
      if(pathname !== "/chats") {
        dispatch(receiveMessageWhileNotOnChatsPageSuccess(chatId));
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [dispatch, pathname]);

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="auth" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<HomePage />} />
            <Route path="me" element={<MyProfilePage />} />
            <Route path="user/:userId" element={<UserProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="logs" element={<ActivityLogsPage />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="post/:postId" element={<SinglePostPage />} />
            <Route path="photo/:albumId/:photoId" element={<SinglePhotoPage />} />
            <Route path="search" element={<SearchUsers />} />
            <Route path="info" element={<AppInfoPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
