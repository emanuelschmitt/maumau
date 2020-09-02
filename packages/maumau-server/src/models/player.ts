import Card from './card';

const DISCONNECT_THRESHOLD_MS = 10 * 1000;

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

  giveCard(card: Card): Player {
    this.hand.push(card);
    return this;
  }

  updateLastSeen(): void {
    this.lastSeen = Date.now();
  }

  isDisconnected(): boolean {
    return Date.now() - this.lastSeen >= DISCONNECT_THRESHOLD_MS;
  }
}
