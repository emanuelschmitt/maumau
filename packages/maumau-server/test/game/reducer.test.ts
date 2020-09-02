import { ActionType } from '../../src/game/action-type';
import GameState from '../../src/game/game-state';
import { reducer } from '../../src/game/reducer';
import Card from '../../src/models/card';
import Player from '../../src/models/player';
import { Rank } from '../../src/models/rank';
import { Suit } from '../../src/models/suit';

describe('reducer', () => {
  describe('when PLAY_REGULAR_CARD action', () => {
    const state = new GameState({
      players: [
        { id: '1', name: 'Johnny' },
        { id: '2', name: 'Hugh' },
      ],
    }).getState();
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
    test('should not end game', () => {
      expect(newState.gameEnded).toBeFalsy();
    });
  });

  describe('when ACCEPT_PENDING_SEVENS action with 2 players', () => {
    let state = new GameState({
      players: [
        { id: '1', name: 'Johnny' },
        { id: '2', name: 'Hugh' },
      ],
    }).getState();
    const cardsCount = state.players[1].hand.length;
    state = reducer(state, {
      type: ActionType.PLAY_SEVEN,
      payload: new Card(Suit.CLUBS, Rank.SEVEN),
    });
    const stackCount = state.stack.length;
    state = reducer(state, {
      type: ActionType.ACCEPT_PENDING_SEVENS,
    });
    test('player should have 2 more cards', () => {
      expect(state.players[1].hand).toHaveLength(cardsCount + 2);
    });
    test('stack should have 2 less cards', () => {
      expect(state.stack).toHaveLength(stackCount - 2);
    });
    test('should not set next player', () => {
      expect(state.playersTurnIndex).toEqual(1);
    });
    test('should not end game', () => {
      expect(state.gameEnded).toBeFalsy();
    });
  });

  describe('when ACCEPT_PENDING_SEVENS action with 4 cards and 4 players', () => {
    let state = new GameState({
      players: [
        { id: '1', name: 'Johnny' },
        { id: '2', name: 'Hugh' },
        { id: '3', name: 'Marc' },
        { id: '4', name: 'John' },
      ],
    }).getState();

    state = reducer(state, {
      type: ActionType.PLAY_SEVEN,
      payload: new Card(Suit.CLUBS, Rank.SEVEN),
    });
    state = reducer(state, {
      type: ActionType.PLAY_SEVEN,
      payload: new Card(Suit.DIAMONDS, Rank.SEVEN),
    });
    state = reducer(state, {
      type: ActionType.PLAY_SEVEN,
      payload: new Card(Suit.HEARTS, Rank.SEVEN),
    });
    state = reducer(state, {
      type: ActionType.PLAY_SEVEN,
      payload: new Card(Suit.SPADES, Rank.SEVEN),
    });
    const cardsCount = state.players[0].hand.length;
    const stackCount = state.stack.length;
    state = reducer(state, {
      type: ActionType.ACCEPT_PENDING_SEVENS,
    });
    test('player should have 8 more cards', () => {
      expect(state.players[0].hand).toHaveLength(cardsCount + 8);
    });
    test('stack should have 8 less cards', () => {
      expect(state.stack).toHaveLength(stackCount - 8);
    });
    test('should not set next player', () => {
      expect(state.playersTurnIndex).toEqual(0);
    });
    test('should not end game', () => {
      expect(state.gameEnded).toBeFalsy();
    });
  });

  describe('when PLAY_REGULAR_CARD with last card', () => {
    let state = new GameState({
      players: [
        { id: '1', name: 'Johnny' },
        { id: '2', name: 'Hugh' },
      ],
    }).getState();

    const card = new Card(Suit.CLUBS, Rank.NINE);
    state.players[0].hand = [card];
    state.stack = [new Card(Suit.CLUBS, Rank.KING)];
    state = reducer(state, {
      type: ActionType.PLAY_REGULAR_CARD,
      payload: card,
    });
  });

  describe('when PLAY_EIGHT as last card and two players', () => {
    const state = new GameState({
      players: [
        { id: '1', name: 'Johnny' },
        { id: '2', name: 'Hugh' },
      ],
    });
    const card = new Card(Suit.CLUBS, Rank.EIGHT);
    const player = new Player('1', 'Johnny', [card]);
    state.setPartialState({
      players: [player, state.getState().players[1]],
      stack: [new Card(Suit.CLUBS, Rank.KING)],
    });
    state.dispatch({
      type: ActionType.PLAY_EIGHT,
      payload: card,
    });
    test('should end game', () => {
      expect(state.getState().gameEnded).toMatchObject({ id: '1', type: 'PLAYER_WON' });
    });
  });
});
