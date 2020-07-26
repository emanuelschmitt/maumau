import { ActionType } from '../../models/action';
import { ListenerFunction } from '../game-state';
import { State } from '../reducer';

function hasOnePlayerGotZeroCards(state: State) {
  let condition = false;

  for (const player of state.players) {
    condition = player.hand.length === 0;

    if (condition) {
      break;
    }
  }

  return condition;
}

export const hasGameEnded: ListenerFunction = (state, dispatch) => {
  if (!state.gameEnded && hasOnePlayerGotZeroCards(state)) {
    dispatch({
      type: ActionType.END_GAME,
    });
  }
};
