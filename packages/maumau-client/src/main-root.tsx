import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { ConnectionContextProvider } from './connection-context';
import Game from './game';
import NotFoundPage from './not-found-page';
import PoolPage from './pool-page';
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
        <Switch>
          <Route path="/" exact>
            <PoolPage />
          </Route>
          <Route path="/game" exact>
            <WebSockerStatusBar />
            <Game />
          </Route>
          <Route
            render={({ staticContext }: any) => {
              if (staticContext) {
                staticContext.status = 404;
              }
              return <NotFoundPage />;
            }}
          ></Route>
        </Switch>
      </Frame>
    </ConnectionContextProvider>
  );
}

export default MainRoot;
