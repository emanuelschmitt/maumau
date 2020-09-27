import { Rank, Suit, Card } from 'maumau-server/src/types';
import React from 'react';

import PlayerHand, { Props } from '../player-hand';

export default {
  title: 'Game/Player hand',
  component: PlayerHand,
};

const noOp = () => NaN;

const props: Props = {
  hand: [
    {
      rank: Rank.ACE,
      suit: Suit.DIAMONDS,
    } as Card,
    {
      rank: Rank.SEVEN,
      suit: Suit.HEARTS,
    } as Card,
    {
      rank: Rank.JACK,
      suit: Suit.SPADES,
    } as Card,
    {
      rank: Rank.TEN,
      suit: Suit.SPADES,
    } as Card,
    {
      rank: Rank.EIGHT,
      suit: Suit.SPADES,
    } as Card,
  ],
  canPlayCard: () => true,
  onPlayCard: noOp,
  onSelectJack: noOp,
};

export const Default: React.SFC<{}> = () => {
  return <PlayerHand {...props} />;
};
