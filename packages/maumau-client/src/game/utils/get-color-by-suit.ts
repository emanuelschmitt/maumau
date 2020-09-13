import { Suit } from 'maumau-server/src/types';

export function getColorBySuit(suit: Suit) {
  switch (suit) {
    case Suit.CLUBS:
    case Suit.SPADES:
      return '#262626';
    case Suit.DIAMONDS:
    case Suit.HEARTS:
      return 'red';
  }
}
