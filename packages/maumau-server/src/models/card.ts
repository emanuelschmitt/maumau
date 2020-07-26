import { Rank } from './rank';
import { Suit } from './suit';

export default class Card {
  constructor(public suit: Suit, public rank: Rank) {}
  public isEqual(card: Card): boolean {
    return card.rank === this.rank && card.suit === this.suit;
  }
  public isRegular(): boolean {
    return [Rank.ACE, Rank.NINE, Rank.TEN, Rank.QUEEN, Rank.KING].includes(this.rank);
  }
  public isSeven(): boolean {
    return this.rank === Rank.SEVEN;
  }
  public isEight(): boolean {
    return this.rank === Rank.EIGHT;
  }
  public isJack(): boolean {
    return this.rank === Rank.JACK;
  }
  public doesMatch(to: Card): boolean {
    return this.rank === to.rank || this.suit === to.suit;
  }
  public matchesNextSuit(suit: Suit | null): boolean {
    if (!suit) {
      return true;
    }
    return this.suit === suit;
  }
  public static fromObject({ suit, rank }: { rank: string; suit: string }): Card {
    return new Card(suit as Suit, rank as Rank);
  }
}
