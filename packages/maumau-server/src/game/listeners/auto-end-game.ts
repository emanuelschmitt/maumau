import { ActionType } from '../action-type';
import { ListenerFunction } from '../game-state';
import { GameEndReason } from '../reducer';

export const autoEndGame: ListenerFunction = (state, dispatch) => {
  if (Boolean(state.gameEnded)) {
    return;
  }

  for (const player of state.players) {
    if (player.hand.length === 0) {
      dispatch({
        type: ActionType.END_GAME,
        payload: {
          type: GameEndReason.PLAYER_WON,
          id: player.id,
        },
      });
      break;
    }
  }
};
