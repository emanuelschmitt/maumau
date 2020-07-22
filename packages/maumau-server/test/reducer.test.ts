import { initalizeGame } from '../src/game/game';
import { reducer } from '../src/game/reducer';
import { ActionType } from '../src/models/action';

describe('reducer', () => {
  describe('when PLAY_REGULAR_CARD action', () => {
    const state = initalizeGame(2);
    const cardToPlay = state.players[0].hand[0];
    const newState = reducer(state, {
      type: ActionType.PLAY_REGULAR_CARD,
      payload: cardToPlay,
    });

    test('should remove card from current players hand', () => {
      expect(newState.players[0].hand.includes(cardToPlay)).toBeFalsy();
    });

    test('should set next player', () => {
      expect(newState.playersTurnIndex).toEqual(1);
    });

    test('should append card to stack', () => {
      expect(newState.stack.includes(cardToPlay)).toBeTruthy();
    });
  });
});
