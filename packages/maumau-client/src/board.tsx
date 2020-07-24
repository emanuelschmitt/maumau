import React from 'react';

import Card, { getBackgroundUrl } from './card';
import CardFrame from './card-frame';
import CardStack from './card-stack';
import { useConnectionContext } from './connection-context';
import Deck from './deck';
import Grid from './grid';

function Board() {
  const { state } = useConnectionContext();

  if (!state) {
    return null;
  }

  const { players } = state;

  return (
    <Grid.Container>
      <Grid.One>
        <Deck>
          {players[0].hand.map((card) => (
            <Card card={card} player={players[0]} />
          ))}
        </Deck>
      </Grid.One>
      <Grid.Two>
        <CardFrame backgroundUrl={getBackgroundUrl(state.stack[state.stack.length - 1])} />
      </Grid.Two>
      <Grid.Three>
        <CardStack />
      </Grid.Three>
      <Grid.Four>
        <Deck>
          {players[1].hand.map((card) => (
            <Card card={card} player={players[1]} />
          ))}
        </Deck>
      </Grid.Four>
    </Grid.Container>
  );
}

export default Board;
