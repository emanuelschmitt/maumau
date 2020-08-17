import { Rank } from 'maumau-server/src/types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Actions from './actions';
import JackCard from './card/jack-card';
import PlayableCard from './card/playable-card';
import StackCard from './card/stack-card';
import TopCard from './card/top-card';
import { useGameContext } from './context/game-context';
import { useSessionContext } from './context/session-context';
import Deck from './deck';
import Grid from './ui/grid';
import JumboTron from './ui/jumbotron';

function Game() {
  const [session] = useSessionContext();
  const game = useGameContext();

  if (!session.sessionId) {
    return <Redirect to="/" />;
  }

  if (!game?.state) {
    return null;
  }

  const { players, gameEnded, topCard } = game.state;

  if (gameEnded) {
    return (
      <JumboTron>
        <h1>Game Ended</h1>
      </JumboTron>
    );
  }

  return (
    <Grid.Container>
      <Grid.One>
        <Actions player={players[0]} />
        <Deck>
          {players[0].hand.map((card) =>
            card.rank === Rank.JACK ? (
              <JackCard card={card} player={players[0]} key={JSON.stringify(card)} />
            ) : (
              <PlayableCard card={card} player={players[0]} key={JSON.stringify(card)} />
            ),
          )}
        </Deck>
      </Grid.One>
      <Grid.Two>
        <TopCard card={topCard} />
      </Grid.Two>
      <Grid.Three>
        <StackCard />
      </Grid.Three>
      <Grid.Four>
        <Deck>
          {players[1].hand.map((card) =>
            card.rank === Rank.JACK ? (
              <JackCard card={card} player={players[1]} key={JSON.stringify(card)} />
            ) : (
              <PlayableCard card={card} player={players[1]} key={JSON.stringify(card)} />
            ),
          )}
        </Deck>
        <Actions player={players[1]} />
      </Grid.Four>
    </Grid.Container>
  );
}

export default Game;
