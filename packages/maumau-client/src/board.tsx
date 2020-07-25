import React from 'react';

import Actions from './actions';
import PlayableCard from './card/playable-card';
import StackCard from './card/stack-card';
import TopCard from './card/top-card';
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
        <Actions player={players[0]} />
        <Deck>
          {players[0].hand.map((card) => (
            <PlayableCard card={card} player={players[0]} />
          ))}
        </Deck>
      </Grid.One>
      <Grid.Two>
        <TopCard card={state.stack[state.stack.length - 1]} />
      </Grid.Two>
      <Grid.Three>
        <StackCard />
      </Grid.Three>
      <Grid.Four>
        <Deck>
          {players[1].hand.map((card) => (
            <PlayableCard card={card} player={players[1]} />
          ))}
        </Deck>
        <Actions player={players[1]} />
      </Grid.Four>
    </Grid.Container>
  );
}

export default Board;
