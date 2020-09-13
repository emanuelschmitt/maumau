import { Opponent, Card as TCard, Player } from 'maumau-server/src/types';
import React from 'react';

import Card from './card';
import CardBack from './card-back';
import Grid from './grid';
import OpponentPanel from './opponent-panel';
import PlayerHand from './player-hand';
import SuitSelection from './suit-selection';
import SwitchButton from './switch-button';

export type GameBoardProps = {
  opponents: Opponent[];
  topCard: TCard;
  player: Player;
  pendingSeven: number;
};

function GameBoard({ opponents, topCard, player, pendingSeven }: GameBoardProps) {
  return (
    <Grid.Container>
      <Grid.One>
        {opponents.map((o) => (
          <OpponentPanel name={o.name} cardAmount={o.handCount} isPlaying={o.isPlaying} key={o.id} />
        ))}
      </Grid.One>
      <Grid.Two>
        <SuitSelection onSelection={() => null} />
        <Card rank={topCard.rank} suit={topCard.suit} />
      </Grid.Two>
      <Grid.Three>
        <CardBack cardBadge={pendingSeven ? `+${pendingSeven}` : undefined} />
        <SwitchButton />
      </Grid.Three>
      <Grid.Four>
        <PlayerHand hand={player.hand} />
      </Grid.Four>
    </Grid.Container>
  );
}

export default GameBoard;
