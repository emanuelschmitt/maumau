import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { GameProvider } from './context/game-context';
import { SessionProvider } from './context/session-context';
import GamePage from './game-page';
import PoolJoinPage from './join-page';
import PoolLoadingPage from './loading-page';
import NotFoundPage from './not-found-page';
import SEO from './seo';
import GlobalStyle from './styles/styles';
import Tracking from './tracking';

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
    <>
      <SEO />
      <Tracking />
      <SessionProvider>
        <GlobalStyle />
        <Frame>
          <Switch>
            <Route path="/" exact>
              <PoolJoinPage />
            </Route>
            <Route path="/loading">
              <PoolLoadingPage />
            </Route>
            <Route path="/game" exact>
              <GameProvider>
                <GamePage />
              </GameProvider>
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
      </SessionProvider>
    </>
  );
}

export default MainRoot;
