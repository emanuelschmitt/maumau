import { Suit, Rank } from 'maumau-server/src/types';
import React from 'react';

import Card from '../card';

export default {
  title: 'Game/Card',
  component: Card,
};

export const Default: React.SFC<{}> = () => <Card suit={Suit.CLUBS} rank={Rank.EIGHT} />;
export const Hearts: React.SFC<{}> = () => <Card suit={Suit.HEARTS} rank={Rank.SEVEN} />;
export const Diamonds: React.SFC<{}> = () => <Card suit={Suit.DIAMONDS} rank={Rank.SEVEN} />;
export const Clubs: React.SFC<{}> = () => <Card suit={Suit.CLUBS} rank={Rank.SEVEN} />;
export const Spades: React.SFC<{}> = () => <Card suit={Suit.SPADES} rank={Rank.SEVEN} />;
