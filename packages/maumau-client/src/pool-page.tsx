import React from 'react';
import { v4 as uuidV4 } from 'uuid';

import ActionButton from './ui/action-button';
import Input from './ui/input';
import Jumbotron from './ui/jumbotron';
import Label from './ui/label';

function PoolPage() {
  const [{ userId, name }, setState] = React.useState<{
    userId: string;
    name: string;
  }>({
    userId: uuidV4(),
    name: '',
  });

  const canProceed = name.trim().length !== 0;

  return (
    <Jumbotron>
      <h1>Mau Mau</h1>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        <Label>Enter Name</Label>
        <Input value={name} onChange={(event) => setState({ userId, name: event.target.value })} />
      </div>
      <ActionButton disabled={!canProceed}>Join Game</ActionButton>
    </Jumbotron>
  );
}

export default PoolPage;
