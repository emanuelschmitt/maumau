import Card from './card';

export default class Player {
  constructor(public id: number, public name: string, public hand: Card[]) {}
  hasCard(predicate: (card: Card) => boolean) {
    return Boolean(this.hand.find(predicate));
  }
  giveCard(card: Card): void {
    this.hand.push(card);
  }
  getCardOptions(to: Card): Card[] {
    return this.hand.filter((card) => card.doesMatch(to));
  }
}
