import Card from '../models/card';
import Player from '../models/player';
import { allRanks } from '../models/rank';
import { allSuits } from '../models/suit';
import shuffle from '../utils/shuffle';

import { State } from './reducer';

const AMOUNT_OF_CARD_PER_PLAYER: Record<number, number> = {
  2: 7,
  3: 7,
  4: 6,
};

const defaultState: State = {
  stack: [],
  players: [],
  hasDrawnCard: false,
  nextSuit: null,
  pendingSevens: null,
  playersTurnIndex: 0,
  gameEnded: null,
};

export default class GameStateBuilder {
  private gameState: State;

  constructor() {
    this.gameState = defaultState;
  }

  withPlayers(input: Pick<Player, 'id' | 'name'>[]): GameStateBuilder {
    if (input.length < 2 || input.length > 4) {
      throw new Error('Cannot initialize game with ' + input.length + ' players. Only 2-4 players allowed.');
    }

    const players: Player[] = [];
    for (const { id, name } of input) {
      players.push(new Player(id, name));
    }
    this.gameState = { ...this.gameState, players };
    return this;
  }

  withCardStack(): GameStateBuilder {
    const stack: Card[] = [];
    for (const suit of allSuits) {
      for (const rank of allRanks) {
        stack.push(new Card(suit, rank));
      }
    }
    shuffle(stack);
    this.gameState = { ...this.gameState, stack };
    return this;
  }

  withDealtCards(): GameStateBuilder {
    const { players, stack } = this.gameState;

    if (players.length < 2) {
      throw new Error('state needs to be initialized with players first before dealing cards');
    }

    if (stack.length === 0) {
      throw new Error('state needs to be initialized with card stack before dealing cards');
    }

    const numberOfCards = AMOUNT_OF_CARD_PER_PLAYER[players.length];
    if (!numberOfCards) {
      throw new Error('amount of cards per player undefined.');
    }

    for (let i = 0; i < numberOfCards; i++) {
      for (const player of players) {
        const card = stack.pop();
        if (card) {
          player.giveCard(card);
        }
      }
    }

    return this;
  }

  build(): State {
    return this.gameState;
  }
}
