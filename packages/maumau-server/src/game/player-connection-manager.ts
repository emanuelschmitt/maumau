import { logger } from '../server/logger';

import { ActionType } from './action-type';
import { Dispatch } from './game-state';
import { GameEndReason, State } from './reducer';

export default class PlayerConnectionManager {
  private getState: () => State;
  private dispatch: Dispatch;
  private interval: number;

  constructor(getState: () => State, dispatch: Dispatch) {
    this.getState = getState;
    this.dispatch = dispatch;
  }

  public start() {
    this.interval = setInterval(this.checkForDisconnectedPlayer.bind(this), 1000);
  }

  public stop() {
    clearInterval(this.interval);
  }

  private checkForDisconnectedPlayer() {
    const state = this.getState();

    if (state.gameEnded) {
      this.stop();
    }

    for (const player of state.players) {
      if (player.bot) {
        continue;
      }

      if (!player.isDisconnected()) {
        continue;
      }

      this.dispatch({
        type: ActionType.END_GAME,
        payload: {
          id: player.id,
          type: GameEndReason.DISCONNECT,
        },
      });

      logger.debug(`Game ended because player ${player.id} disconnected.`);
      this.stop();
      break;
    }
  }
}
