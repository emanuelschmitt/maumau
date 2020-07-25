import { ActionType } from '../../models/action';
import { ListenerFunction } from '../game-state';
import { getActionTypesForPlayer } from '../rules';

export const autoAcceptSevens: ListenerFunction = (state, dispatch) => {
  const currentPlayer = state.players[state.playersTurnIndex];
  const possibleActions = getActionTypesForPlayer(currentPlayer.id, state);

  if (
    state.pendingSevens &&
    possibleActions.length === 1 &&
    possibleActions.includes(ActionType.ACCEPT_PENDING_SEVENS)
  ) {
    dispatch({
      type: ActionType.ACCEPT_PENDING_SEVENS,
    });
  }
};
