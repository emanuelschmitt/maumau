import { Rank, Suit, Card, Player } from 'maumau-server/src/types';
import React from 'react';

import GameBoard, { GameBoardProps } from '../game-board';

export default {
  title: 'Game/Game board',
  component: GameBoard,
};

const props: GameBoardProps = {
  opponents: [
    {
      id: '1',
      name: 'Lukas',
      handCount: 3,
      isPlaying: true,
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
  pendingSeven: 2,
};

export const Default: React.SFC<{}> = () => {
  const [state, setState] = React.useState(props);

  React.useEffect(() => {
    setTimeout(() => {
      setState({
        ...state,
        player: {
          ...state.player,
          hand: [
            ...state.player.hand.slice(0, 1),
            {
              rank: Rank.ACE,
              suit: Suit.HEARTS,
            } as Card,
          ],
        },
      });
    }, 3000);
  }, [setState, state]);

  return <GameBoard {...state} />;
};
