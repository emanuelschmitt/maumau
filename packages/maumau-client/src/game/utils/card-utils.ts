import { Card, Rank } from 'maumau-server/src/types';

export function isCardMatch(a: Card, b: Card): boolean {
  return a.rank === b.rank || a.suit === b.suit;
}

export function isCardJack(a: Card): boolean {
  return a.rank === Rank.JACK;
}
