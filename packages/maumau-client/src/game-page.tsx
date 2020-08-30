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
import Opponent from './opponent';
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

  const { player, gameEnded, topCard, opponents } = game.state;

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
        {opponents.map((o) => (
          <Opponent opponent={o} key={o.id} />
        ))}
      </Grid.One>
      <Grid.Two>
        <TopCard card={topCard} />
      </Grid.Two>
      <Grid.Three>
        <StackCard />
      </Grid.Three>
      <Grid.Four>
        <Deck>
          {player.hand.map((card) =>
            card.rank === Rank.JACK ? (
              <JackCard card={card} player={player} key={JSON.stringify(card)} />
            ) : (
              <PlayableCard card={card} player={player} key={JSON.stringify(card)} />
            ),
          )}
        </Deck>
        <Actions player={player} />
      </Grid.Four>
    </Grid.Container>
  );
}

export default Game;
