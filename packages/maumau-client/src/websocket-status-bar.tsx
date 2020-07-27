import React from 'react';
import { ReadyState } from 'react-use-websocket';
import styled from 'styled-components';

import { useConnectionContext } from './connection-context';

const Bar = styled.div<{ connected: boolean }>((props) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  background: props.connected ? '#20bf6b' : '#eb3b5a',
  color: 'white',
  padding: '16px 32px',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  textTransform: 'uppercase',
}));

function WebSocketStatusBar() {
  const { readyState } = useConnectionContext();
  const isConnected = readyState === ReadyState.OPEN;
  return <Bar connected={isConnected}>{isConnected ? 'Connected' : 'Disconnected'}</Bar>;
}

export default WebSocketStatusBar;
