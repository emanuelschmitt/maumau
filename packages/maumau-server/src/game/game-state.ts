import { logger } from '../server/logger';

import { ActionType } from './action-type';
import { getClientStateForPlayerId } from './client-state-adapter';
import GameStateBuilder from './game-state-builder';
import { autoAcceptSevens } from './listeners/auto-accept-seven';
import { autoEndGame } from './listeners/auto-end-game';
import { autoKannet } from './listeners/auto-kannet';
import { reducer, State, Action, GameEndReason } from './reducer';
import { getActionTypesForPlayer } from './rules';

type Options = {
  players: { id: string; name: string }[];
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
      if (player.isDisconnected()) {
        this.dispatch({
          type: ActionType.END_GAME,
          payload: {
            type: GameEndReason.DISCONNECT,
            id: player.id,
          },
        });
        logger.debug(`Game ended because player ${player.id} disconnected.`);
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
    this.state = new GameStateBuilder().withPlayers(options.players).withCardStack().withDealtCards().build();
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
