import { Suit } from 'maumau-server/src/types';
import React from 'react';

import ClubsIcon from '../icons/clubs';
import DiamondsIcon from '../icons/diamonds';
import HeartsIcon from '../icons/hearts';
import SpadesIcon from '../icons/spades';

import { getColorBySuit } from './utils/get-color-by-suit';

function ComponentIconBySuit(suit: Suit) {
  switch (suit) {
    case Suit.CLUBS: {
      return ClubsIcon;
    }
    case Suit.HEARTS: {
      return HeartsIcon;
    }
    case Suit.DIAMONDS: {
      return DiamondsIcon;
    }
    case Suit.SPADES: {
      return SpadesIcon;
    }
  }
}

type Props = {
  suit: Suit;
  colored?: boolean;
} & React.HTMLProps<SVGElement>;

function SuitIcon({ suit, colored = true, ...props }: Props) {
  const Component = ComponentIconBySuit(suit);
  const color = getColorBySuit(suit);
  return <Component style={colored ? { color } : undefined} {...(props as any)} />;
}

export default SuitIcon;
