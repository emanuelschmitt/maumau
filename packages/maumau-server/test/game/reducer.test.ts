import { ActionType } from '../../src/game/action-type';
import GameState from '../../src/game/game-state';
import { reducer } from '../../src/game/reducer';
import Card from '../../src/models/card';
import { Rank } from '../../src/models/rank';
import { Suit } from '../../src/models/suit';

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

  describe('when ACCEPT_PENDING_SEVENS action with 2 players', () => {
    let state = new GameState({ amountPlayers: 2 }).getState();
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
  });

  describe('when ACCEPT_PENDING_SEVENS action with 4 cards and 4 players', () => {
    let state = new GameState({ amountPlayers: 4 }).getState();
    const cardsCount = state.players[0].hand.length;
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
  });

  describe('when PLAY_REGULAR_CARD with last card', () => {
    let state = new GameState({ amountPlayers: 2 }).getState();
    const card = new Card(Suit.CLUBS, Rank.NINE);
    state.players[0].hand = [card];
    state.stack = [new Card(Suit.CLUBS, Rank.KING)];
    state = reducer(state, {
      type: ActionType.PLAY_REGULAR_CARD,
      payload: card,
    });
    test('that game has ended', () => {
      expect(state.gameEnded).toBeTruthy();
    });
  });

  describe('when PLAY_EIGHT with last card and two players', () => {
    let state = new GameState({ amountPlayers: 2 }).getState();
    const card = new Card(Suit.CLUBS, Rank.EIGHT);
    state.players[0].hand = [card];
    state.stack = [new Card(Suit.CLUBS, Rank.KING)];
    state = reducer(state, {
      type: ActionType.PLAY_EIGHT,
      payload: card,
    });
    test('that game has not ended', () => {
      expect(state.gameEnded).toBeFalsy();
    });
  });

  describe('when PLAY_EIGHT with last card and three players', () => {
    let state = new GameState({ amountPlayers: 3 }).getState();
    const card = new Card(Suit.CLUBS, Rank.EIGHT);
    state.players[0].hand = [card];
    state.stack = [new Card(Suit.CLUBS, Rank.KING)];
    state = reducer(state, {
      type: ActionType.PLAY_EIGHT,
      payload: card,
    });
    test('that game has ended', () => {
      expect(state.gameEnded).toBeTruthy();
    });
  });

  describe('when PLAY_JACK action', () => {
    let state = new GameState({ amountPlayers: 2 }).getState();
    const card = new Card(Suit.CLUBS, Rank.JACK);
    state.players[0].hand.push(card);
    state = reducer(state, {
      type: ActionType.PLAY_JACK,
      payload: { card: card, suit: Suit.HEARTS },
    });
    test('card has been added to the stack', () => {
      expect(state.stack[state.stack.length - 1]).toBe(card);
    });
    test('card has been removed from players hand', () => {
      expect(state.players[0].hand).not.toContain(card);
    });
    test('next suit is set', () => {
      expect(state.nextSuit).toBe(Suit.HEARTS);
    });
    test('next player index is set', () => {
      expect(state.playersTurnIndex).toEqual(1);
    });
    test('that game has ended', () => {
      expect(state.gameEnded).toBeFalsy();
    });
  });
});
