import { Suit, Rank, Card } from 'maumau-server/src/types';
import React from 'react';

import TopCard, { Props } from '../top-card';

export default {
  title: 'Game/Top Card',
  component: TopCard,
};

const props: Props = {
  card: {
    rank: Rank.ACE,
    suit: Suit.DIAMONDS,
  } as Card,
};

export const Default: React.SFC<{}> = () => <TopCard {...props} />;
export const WithNextSuit: React.SFC<{}> = () => <TopCard {...props} nextSuit={Suit.SPADES} />;
