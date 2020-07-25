import { ActionType } from '../../models/action';
import { ListenerFunction } from '../game-state';
import { getActionTypesForPlayer } from '../rules';

export const doKannetIfOnlyOption: ListenerFunction = (state, dispatch) => {
  const currentPlayer = state.players[state.playersTurnIndex];
  const possibleActions = getActionTypesForPlayer(currentPlayer.id, state);

  if (state.hasDrawnCard && possibleActions.length === 1 && possibleActions.includes(ActionType.KANNET)) {
    dispatch({
      type: ActionType.KANNET,
    });
  }
};
