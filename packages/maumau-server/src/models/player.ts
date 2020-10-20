import { BotDifficulty } from './bot-difficulty';
import Card from './card';

const DISCONNECT_THRESHOLD_MS = 10 * 1000;

export default class Player {
  public id: string;
  public name: string;
  public bot: BotDifficulty | undefined;
  public hand: Card[];
  private lastSeen: number;

  constructor(id: string, name: string, bot: BotDifficulty | undefined, hand: Card[] = []) {
    this.id = id;
    this.name = name;
    this.bot = bot;
    this.hand = hand;
    this.lastSeen = Date.now();
  }

  isBot(): boolean {
    return Boolean(this.bot);
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
