import axios from 'axios';
import React from 'react';
import { useQuery, useMutation } from 'react-query';
import { Redirect } from 'react-router-dom';

import * as client from './api/client';
import { useSessionContext, ActionType } from './context/session-context';
import LoadingIcon from './icons/loading';
import ActionButton from './ui/action-button';
import Error from './ui/error';
import Jumbotron from './ui/jumbotron';

function useGetStatusQuery(userId: string) {
  return useQuery('status', () => client.getStatusByUserId(userId), {
    refetchInterval: 1000,
    cacheTime: 0,
  });
}

function useLeavePoolMutation(userId: string) {
  return useMutation(async () => {
    const response = await axios.put('/api/pool/leave', { id: userId });
    return response.data;
  });
}

function PoolLoadingPage() {
  const [session, dispatch] = useSessionContext();
  const { data, isError } = useGetStatusQuery(session.userId);
  const [leave, { isSuccess: hasLeft }] = useLeavePoolMutation(session.userId);

  React.useEffect(() => {
    if (data?.status === 'MATCHED' && data?.sessionId) {
      dispatch({
        type: ActionType.SET_SESSION_ID,
        payload: { sessionId: data.sessionId },
      });
    }
  }, [data]);

  if (data?.status === 'UNJOINED' || hasLeft) {
    return <Redirect to="/" />;
  }

  if (data?.status === 'MATCHED') {
    return <Redirect to="/game" />;
  }

  return (
    <Jumbotron>
      <h1>Loading...</h1>
      <LoadingIcon fontSize="4em" />
      <p>Waiting for other players.</p>
      <ActionButton onClick={() => leave()}>Cancel</ActionButton>
      {isError && <Error>An error occured.</Error>}
    </Jumbotron>
  );
}

export default PoolLoadingPage;
