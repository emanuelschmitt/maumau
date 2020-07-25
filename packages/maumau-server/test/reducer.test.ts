import GameState from '../src/game/game-state';
import { reducer } from '../src/game/reducer';
import { ActionType } from '../src/models/action';
import Card from '../src/models/card';
import { Rank } from '../src/models/rank';
import { Suit } from '../src/models/suit';

describe('reducer', () => {
  describe('when PLAY_REGULAR_CARD action', () => {
    const state = new GameState({ amountPlayers: 2 }).getState();
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

  describe('when ACCEPT_PENDING_SEVENS action', () => {
<<<<<<< HEAD
    let state = initalizeGame(2);
=======
    let state = new GameState({ amountPlayers: 2 }).getState();
>>>>>>> 5417c3c... refactor: refactor game state
    const cardsCount = state.players[1].hand.length;
    state = reducer(state, {
      type: ActionType.PLAY_SEVEN,
      payload: new Card(Suit.CLUBS, Rank.SEVEN),
    });
    state = reducer(state, {
      type: ActionType.ACCEPT_PENDING_SEVENS,
    });
    test('player should have 2 more cards', () => {
      expect(state.players[1].hand).toHaveLength(cardsCount + 2);
    });
  });
});
