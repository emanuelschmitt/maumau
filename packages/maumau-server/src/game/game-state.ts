import Card from '../models/card';
import Player from '../models/player';
import { allRanks } from '../models/rank';
import { allSuits } from '../models/suit';
import shuffle from '../utils/shuffle';

import { autoAcceptSevens } from './listeners/auto-accept-seven';
import { doKannetIfOnlyOption } from './listeners/do-kannet-if-only-option';
import { hasGameEnded } from './listeners/has-game-ended';
import { reducer, State, Action } from './reducer';

const AMOUNT_OF_CARD_PER_PLAYER = 7;

type Options = {
  amountPlayers: number;
};
type Dispatch = (action: Action) => State;
export type ListenerFunction = (state: State, dispatch: Dispatch) => void;

export default class GameState {
  private state: State;
  private listeners: Array<ListenerFunction>;
  private isDispatching: boolean;

  constructor(options: Options) {
    this.isDispatching = false;
    this.listeners = [];

    this.validateOptions(options);
    this.initializeGame(options);
    this.registerListeners();
  }

  public getState(): State {
    if (this.isDispatching) {
      throw new Error('cannot retrieve state while dispatching.');
    }
    return this.state;
  }

  public dispatch(action: Action): State {
    this.isDispatching = false;

    try {
      this.isDispatching = true;
      this.state = reducer(this.state, action);
    } finally {
      this.isDispatching = false;
    }

    for (const listener of this.listeners) {
      listener(this.getState(), this.dispatch.bind(this));
    }

    return this.state;
  }

  public registerListeners() {
    const listeners: ListenerFunction[] = [hasGameEnded, doKannetIfOnlyOption, autoAcceptSevens];
    this.listeners.push(...listeners);
  }

  private validateOptions({ amountPlayers }: Options): void {
    if (amountPlayers < 2 || amountPlayers > 4) {
      throw new Error('Cannot initialize game with ' + amountPlayers + ' players. Only 2-4 players allowed.');
    }
  }

  private initializeGame(options: Options): void {
    const players = this.initializePlayers(options.amountPlayers);
    const cards = this.initalizeCardStack();

    shuffle(cards);
    this.dealCards(players, cards);

    this.state = {
      stack: cards,
      players,
      hasDrawnCard: false,
      nextSuit: null,
      pendingSevens: null,
      playersTurnIndex: 0,
      gameEnded: false,
    };
  }

  private initializePlayers(n: number): Player[] {
    const players: Player[] = [];
    for (let i = 0; i < n; i++) {
      players.push(new Player(i, `P${i}`, []));
    }
    return players;
  }

  private initalizeCardStack(): Card[] {
    const stack: Card[] = [];
    for (const suit of allSuits) {
      for (const rank of allRanks) {
        stack.push(new Card(suit, rank));
      }
    }
    return stack;
  }

  private dealCards(players: Player[], cardStack: Card[]) {
    for (let i = 0; i < AMOUNT_OF_CARD_PER_PLAYER; i++) {
      for (const player of players) {
        const card = cardStack.pop();
        if (card) {
          player.giveCard(card);
        }
      }
    }
  }

  /**
   * FOR TESTING, DO NOT CALL.
   * @param state state
   */
  public setPartialState(state: Partial<State>) {
    this.state = {
      ...this.state,
      ...state,
    };
  }
}
