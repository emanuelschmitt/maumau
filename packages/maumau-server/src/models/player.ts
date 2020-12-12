import { BotDifficulty } from '../bot/bot-difficulty';

import Card from './card';

const DISCONNECT_THRESHOLD_MS = 20 * 1000;

export default class Player {
  public id: string;
  public name: string;
  public bot?: BotDifficulty;
  public hand: Card[];
  private lastSeen: number;

  constructor(id: string, name: string, bot?: BotDifficulty, hand: Card[] = []) {
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
    const delta = Date.now() - this.lastSeen;
    return delta >= DISCONNECT_THRESHOLD_MS;
  }
}
