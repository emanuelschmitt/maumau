import { BotDifficulty } from '../models/bot-difficulty';
import Card from '../models/card';
import Player from '../models/player';
import { allRanks } from '../models/rank';
import { allSuits } from '../models/suit';
import { logger } from '../server/logger';
import shuffle from '../utils/shuffle';

import { ActionType } from './action-type';
import { getClientStateForPlayerId } from './client-state-adapter';
import { autoAcceptSevens } from './listeners/auto-accept-seven';
import { autoEndGame } from './listeners/auto-end-game';
import { autoKannet } from './listeners/auto-kannet';
import { reducer, State, Action, GameEndReason } from './reducer';
import { getActionTypesForPlayer } from './rules';

const AMOUNT_OF_CARD_PER_PLAYER: Record<number, number> = {
  2: 7,
  3: 7,
  4: 6,
};

type Options = {
  players: { id: string; name: string, bot: BotDifficulty | undefined }[];
};

type Dispatch = (action: Action) => State;
export type ListenerFunction = (state: State, dispatch: Dispatch) => void;

export default class GameState {
  private state: State;
  private listeners: Array<ListenerFunction>;
  private isDispatching: boolean;
  private interval: number;

  constructor(options: Options) {
    this.isDispatching = false;
    this.listeners = [];

    this.validateOptions(options);
    this.initializeGame(options);
    this.registerListeners();
    this.startPlayerHeartBeats();
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
      throw new Error('forbidden action: ' + action.type);
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
    const listeners: ListenerFunction[] = [autoEndGame, autoKannet, autoAcceptSevens];
    this.listeners.push(...listeners);
  }

  public startPlayerHeartBeats() {
    this.interval = setInterval(this.checkForDisconnectedPlayer.bind(this), 1000);
  }

  public stopPlayerHeartBeats() {
    clearInterval(this.interval);
  }

  public checkForDisconnectedPlayer() {
    if (this.state.gameEnded) {
      this.stopPlayerHeartBeats();
    }

    for (const player of this.state.players) {
      if (player.bot == undefined && player.isDisconnected()) {
        this.dispatch({
          type: ActionType.END_GAME,
          payload: {
            type: GameEndReason.DISCONNECT,
            id: player.id,
          },
        });
        logger.debug(`Game ended because player ${player.name} disconnected.`);
        this.stopPlayerHeartBeats();
        break;
      }
    }
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
      gameEnded: null,
    };
  }

  private initializePlayers(options: { id: string; name: string, bot: BotDifficulty | undefined }[]): Player[] {
    const players: Player[] = [];
    for (const { id, name, bot } of options) {
      players.push(new Player(id, name, bot));
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
