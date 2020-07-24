import { Card as TCard, Rank, Suit } from 'maumau-server/src/types';

const rankMap: Record<Rank, string> = {
  [Rank.ACE]: 'A',
  [Rank.KING]: 'K',
  [Rank.QUEEN]: 'Q',
  [Rank.JACK]: 'J',
  [Rank.TEN]: '10',
  [Rank.NINE]: '9',
  [Rank.EIGHT]: '8',
  [Rank.SEVEN]: '7',
};

const suitMap: Record<Suit, string> = {
  [Suit.CLUBS]: 'C',
  [Suit.DIAMONDS]: 'D',
  [Suit.HEARTS]: 'H',
  [Suit.SPADES]: 'S',
};

export function getCardAssetUrlByCard(card: TCard) {
  return `/static/${rankMap[card.rank]}${suitMap[card.suit]}.png`;
}

export function getCardAssetForStackCard() {
  return `/static/purple_back.png`;
}
