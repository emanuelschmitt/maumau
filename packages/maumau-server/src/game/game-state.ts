import { BotDifficulty } from '../bot/bot-difficulty';
import BotController from '../controllers/bot';

import { getClientStateForPlayerId } from './client-state-adapter';
import GameStateBuilder from './game-state-builder';
import { autoAcceptSevens } from './listeners/auto-accept-seven';
import { autoEndGame } from './listeners/auto-end-game';
import { autoKannet } from './listeners/auto-kannet';
import PlayerConnectionManager from './player-connection-manager';
import { reducer, State, Action } from './reducer';
import { getActionTypesForPlayer } from './rules';

const isTest = process.env.NODE_ENV === 'test';

export type GameStateOptions = {
  players: { id: string; name: string; bot?: BotDifficulty }[];
};

export type Dispatch = (action: Action) => State;
export type ListenerFunction = (state: State, dispatch: Dispatch) => void;

export default class GameState {
  private state: State;
  private listeners: Array<ListenerFunction>;
  private isDispatching: boolean;
  private botController: BotController;
  private playerConnectionManager: PlayerConnectionManager;

  constructor({ players }: GameStateOptions) {
    this.isDispatching = false;
    this.listeners = [];

    this.state = new GameStateBuilder().withPlayers(players).withCardStack().withDealtCards().build();
    this.playerConnectionManager = new PlayerConnectionManager(this.state, this.dispatch.bind(this));
    this.botController = new BotController({
      onBotPlaying: (userId: string, action: Action) => {
        this.dispatchForPlayer(userId, action);
      },
    });

    this.registerListeners();

    if (!isTest) {
      this.playerConnectionManager.start();
    }
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

    this.playBotIfNeeded();

    return this.state;
  }

  private playBotIfNeeded() {
    const player = this.state.players[this.state.playersTurnIndex];
    if (player.bot) {
      this.botController.playAction(this.state, player.bot);
    }
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
