import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';

import { useSessionContext, ActionType } from './context/session-context';
import LoadingIcon from './icons/loading';
import Error from './ui/error';
import Jumbotron from './ui/jumbotron';

function PoolLoadingPage() {
  const [session, dispatch] = useSessionContext();

  const { data, isError } = useQuery(
    'status',
    async () => {
      const response = await axios.get(`/api/pool/status/${session.userId}`);
      return response.data;
    },
    { refetchInterval: 2000, cacheTime: 0 },
  );

  React.useEffect(() => {
    if (data?.status === 'MATCHED' && data?.sessionId) {
      dispatch({
        type: ActionType.SET_SESSION_ID,
        payload: { sessionId: data.sessionId },
      });
    }
  }, [data]);

  if (data?.status === 'UNJOINED') {
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
      {isError && <Error>An error occured.</Error>}
    </Jumbotron>
  );
}

export default PoolLoadingPage;
