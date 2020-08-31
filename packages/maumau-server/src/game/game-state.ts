import Card from '../models/card';
import Player from '../models/player';
import { allRanks } from '../models/rank';
import { allSuits } from '../models/suit';
import shuffle from '../utils/shuffle';

import { getClientStateForPlayerId } from './client-state-adapter';
import { autoAcceptSevens } from './listeners/auto-accept-seven';
import { doKannetIfOnlyOption } from './listeners/do-kannet-if-only-option';
import { reducer, State, Action } from './reducer';
import { getActionTypesForPlayer } from './rules';

const AMOUNT_OF_CARD_PER_PLAYER: Record<number, number> = {
  2: 7,
  3: 7,
  4: 6,
};

type Options = {
  players: { id: string; name: string }[];
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

  public dispatchForPlayer(id: string, action: Action): State {
    const player = this.state.players.find(({ id: playerId }) => playerId === id);
    if (!player) {
      throw new Error('cannot dipatch because player is not found');
    }

    player.updateLastSeen();

    const possibleActions = getActionTypesForPlayer(id, this.state);
    if (!possibleActions.includes(action.type)) {
      throw new Error('forbidden action');
    }

    return this.dispatch(action);
  }

  public getClientStateForPlayer(id: string) {
    const player = this.state.players.find(({ id: playerId }) => playerId === id);
    if (!player) {
      throw new Error('cannot get client state. player does not exist.');
    }

    player.updateLastSeen();
    return getClientStateForPlayerId(id, this.getState());
  }

  public registerListeners() {
    const listeners: ListenerFunction[] = [doKannetIfOnlyOption, autoAcceptSevens];
    this.listeners.push(...listeners);
  }

  private validateOptions({ players }: Options): void {
    if (players.length < 2 || players.length > 4) {
      throw new Error('Cannot initialize game with ' + players.length + ' players. Only 2-4 players allowed.');
    }
  }

  private initializeGame(options: Options): void {
    const players = this.initializePlayers(options.players);
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

  private initializePlayers(options: { id: string; name: string }[]): Player[] {
    const players: Player[] = [];
    for (const { id, name } of options) {
      players.push(new Player(id, name));
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
    const numberOfCards = AMOUNT_OF_CARD_PER_PLAYER[players.length];
    if (!numberOfCards) {
      throw new Error('amount of cards per player undefined.');
    }
    for (let i = 0; i < numberOfCards; i++) {
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
