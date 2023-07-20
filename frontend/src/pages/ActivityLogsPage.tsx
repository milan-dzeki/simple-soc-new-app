import { FC, useState, useEffect, useCallback } from 'react';
import axiosActivityLogs from '../axios/axiosActivityLogs';
// types
import { IActivityLog } from '../types/activityLogsPage/types';
// hooks
import { useTypedSelector } from '../hooks/useTypedSelector';
// components
import PageContainer from '../components/Shared/PageContainer';
import Spinner from '../components/Shared/Spinner';
import SingleLog from '../components/ActivityLogsPage/SingleLog';
import DefaultModal from '../components/Modals/DefaultModal';
import ModalBtn from '../components/Buttons/ModalBtn';

const ActivityLogsPage: FC = () => {
  const { authUser } = useTypedSelector(state => state.auth);

  const [logsLoading, setLogsLoading] = useState(false);
  const [logsErrorMsg, setLogsErrorMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<IActivityLog[]>([]);
  const [logToDeleteId, setLogToDeleteId] = useState<string | null>(null);

  const onGetLogs = async() => {
    setLogsLoading(true);

    const token = localStorage.getItem("socNetAppToken");

    try {
      const { data } = await axiosActivityLogs.get("/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(data);
      setLogs(data.acitvityLogs);
    } catch(error) {
      setLogsErrorMsg((error as any).reponse.data.message);
    }

    setLogsLoading(false);
  };

  useEffect(() => {
    onGetLogs();
  }, []);

  const onPrepateDeleteLog = useCallback((logId: string): void => {
    setLogToDeleteId(logId);
  }, []);

  const onCancelDeleteLog = useCallback((): void => {
    setLogToDeleteId(null);
  }, []);

  const onDeleteLog = useCallback(async(): Promise<void> => {
    if(!logToDeleteId) {
      setLogsErrorMsg("Can't find log id. Try again");
      return;
    }
    setLogsLoading(true);
    const token = localStorage.getItem("socNetAppToken");
    try {
      await axiosActivityLogs.delete(`/${logToDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLogs(prev => prev.filter(log => log._id !== logToDeleteId));
    } catch(error) {
      setLogsErrorMsg((error as any).response.data.message);
    }
    setLogToDeleteId(null);
    setLogsLoading(false);
  }, [logToDeleteId]);
  
  return (
    <>
      {
        logToDeleteId !== null && !logsLoading && (
          <DefaultModal
            isErrorModal={false}
            show={logToDeleteId !== null && !logsLoading}
            title="Preparing to delete log"
            text="Are you sure you want to delete this log?"
            onClose={onCancelDeleteLog}>
            <ModalBtn
              btnType="button"
              btnCustomType="btn__cancel"
              btnText="cancel"
              onClick={onCancelDeleteLog} />
            <ModalBtn
              btnType="button"
              btnCustomType="btn__confirm"
              btnText="delete"
              onClick={onDeleteLog} />
          </DefaultModal>
        )
      }
      {
        authUser && (
          <PageContainer
            display="container__block"
            hasPageTitle={true}
            loading={false}
            width="big"
            titleText="Activity Logs"
            titleTextAlign="title__left">
            {
              logsLoading
              ? <Spinner />
              : !logsLoading && logs.length === 0
              ? <p style={{width: "100%", textAlign: "center", fontSize: "1.5rem"}}>No logs</p>
              : logs.map(log => {
                return (
                  <SingleLog
                    key={log._id}
                    id={log._id}
                    logText={log.logText}
                    authUserId={authUser._id}
                    targetUser={log.targetUser}
                    createdAt={log.createdAt}
                    postId={log.postId}
                    photoId={log.photoId}
                    onPrepateDeleteLog={onPrepateDeleteLog} />
                );
              })
            }
          </PageContainer>
        )
      }
    </>
  );
};

export default ActivityLogsPage;