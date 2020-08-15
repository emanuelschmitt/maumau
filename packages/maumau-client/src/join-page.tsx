import axios from 'axios';
import React from 'react';
import { useMutation } from 'react-query';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { useSessionContext, ActionType } from './context/session-context';
import ActionButton from './ui/action-button';
import Error from './ui/error';
import Input from './ui/input';
import Jumbotron from './ui/jumbotron';
import Label from './ui/label';

const Column = styled.div({
  display: 'flex',
  flexDirection: 'column',
  margin: '8px 0',
});

function PoolJoinPage() {
  const [session, dispatch] = useSessionContext();

  const [mutation, { isLoading, data, isSuccess, isError }] = useMutation(async () => {
    const response = await axios.put('/api/pool/join', { name: session.name, id: session.userId });
    return response.data;
  });

  const canProceed = session.name.trim().length !== 0;

  if (!isLoading && isSuccess && data?.status === 'JOINED') {
    return <Redirect to="/loading" />;
  }

  return (
    <Jumbotron>
      <h1>Mau Mau</h1>
      <Column>
        <Label>Enter Name</Label>
        <Input
          value={session.name}
          onChange={(event) =>
            dispatch({
              type: ActionType.SET_NAME,
              payload: { name: event.target.value },
            })
          }
        />
        {isError && <Error>An error occured.</Error>}
      </Column>
      <Column>
        <ActionButton disabled={!canProceed || isLoading} onClick={() => mutation()}>
          Join Game
        </ActionButton>
      </Column>
    </Jumbotron>
  );
}

export default PoolJoinPage;
