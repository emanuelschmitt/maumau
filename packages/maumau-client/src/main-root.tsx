import React from 'react';
import styled from 'styled-components';

import Board from './board';
import { ConnectionContextProvider } from './connection-context';
import WebSockerStatusBar from './websocket-status-bar';

const Frame = styled.div({
  marginTop: 60,
  position: 'relative',
  background: '#40407a',
  height: '100%',
  width: '100%',
});

function MainRoot() {
  return (
    <ConnectionContextProvider url="ws://0.0.0.0:8080">
      <Frame>
        <WebSockerStatusBar />
        <Board />
      </Frame>
    </ConnectionContextProvider>
  );
}

export default MainRoot;
