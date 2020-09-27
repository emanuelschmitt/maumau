import { Suit, Rank, Card } from 'maumau-server/src/types';
import React from 'react';

import PlayableCard, { Props } from '../playable-card';

export default {
  title: 'Game/Playable Card',
  component: PlayableCard,
};

const props: Props = {
  card: {
    rank: Rank.ACE,
    suit: Suit.DIAMONDS,
  } as Card,
};

export const Default: React.SFC<{}> = () => <PlayableCard {...props} />;
export const Disabled: React.SFC<{}> = () => <PlayableCard {...props} buttonProps={{ disabled: true }} />;
