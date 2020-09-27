import { Rank, Suit, Card, Player } from 'maumau-server/src/types';
import React from 'react';

import GameBoard, { GameBoardProps } from '../game-board';

export default {
  title: 'Game/Game board',
  component: GameBoard,
};

const noOp = () => null;

const props: GameBoardProps = {
  opponents: [
    {
      id: '1',
      name: 'Lukas',
      handCount: 3,
      isPlaying: false,
    },
    {
      id: '2',
      name: 'Fred',
      handCount: 1,
      isPlaying: false,
    },
  ],
  player: {
    id: '3',
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
    ],
    name: 'GI Joe',
  } as Player,
  topCard: {
    rank: Rank.JACK,
    suit: Suit.SPADES,
  } as Card,
  pendingSeven: 1,
  playingJack: null,
  nextSuit: Suit.DIAMONDS,
  canDo: () => true,
  onDrawCard: noOp,
  onKannet: noOp,
  canPlayCard: () => true,
  onPlayCard: noOp,
  onPlayJack: noOp,
  onSelectJack: noOp,
  onCancelJack: noOp,
  onAcceptPendingSeven: noOp,
};

export const Default: React.SFC<{}> = () => {
  return <GameBoard {...props} />;
};
