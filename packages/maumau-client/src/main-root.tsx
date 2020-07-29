import React from 'react';
import styled from 'styled-components';

import Board from './board';
import { ConnectionContextProvider } from './connection-context';
import GlobalStyle from './styles';
import WebSockerStatusBar from './websocket-status-bar';

const Frame = styled.div({
  position: 'relative',
  background: '#2c2c54',
  height: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function MainRoot() {
  return (
    <ConnectionContextProvider url="ws://0.0.0.0:8080">
      <GlobalStyle />
      <Frame>
        <WebSockerStatusBar />
        <Board />
      </Frame>
    </ConnectionContextProvider>
  );
}

export default MainRoot;
