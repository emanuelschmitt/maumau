import Card from './card';

const DISCONNECT_THRESHOLD_MS = 30 * 1000;

export default class Player {
  public id: string;
  public name: string;
  public hand: Card[];
  private lastSeen: number;

  constructor(id: string, name: string, hand: Card[] = []) {
    this.id = id;
    this.name = name;
    this.hand = hand;
    this.lastSeen = Date.now();
  }

  hasCard(predicate: (card: Card) => boolean) {
    return Boolean(this.hand.find(predicate));
  }

  giveCard(card: Card): void {
    this.hand.push(card);
  }

  getCardOptions(to: Card): Card[] {
    return this.hand.filter((card) => card.doesMatch(to));
  }

  updateLastSeen(): void {
    this.lastSeen = Date.now();
  }

  hasDisconnect(): boolean {
    return Date.now() - this.lastSeen >= DISCONNECT_THRESHOLD_MS;
  }
}
