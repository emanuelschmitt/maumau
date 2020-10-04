import Card from './card';

const DISCONNECT_THRESHOLD_MS = 10 * 1000;

export default class Player {
  public id: string;
  public name: string;
  public hand: Card[];
  public isBot: boolean;
  private lastSeen: number;

  constructor({ id, name, hand = [], isBot = false }: { id: string; name: string; hand?: Card[]; isBot: boolean }) {
    this.id = id;
    this.name = name;
    this.hand = hand;
    this.isBot = isBot;
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
