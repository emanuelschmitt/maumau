import GameState from '../../src/game/game-state';
import { getActionTypesForPlayer } from '../../src/game/rules';
import Card from '../../src/models/card';
import { Rank } from '../../src/models/rank';
import { Suit } from '../../src/models/suit';

describe('rules', () => {
  // Need to override stack and player's hand to be able to
  // expect specific set of actions.

  test('should show no actions but KANNET_AND_DRAW if no card matches', () => {
    const state = new GameState({ amountPlayers: 2 }).getState();
    state.stack = [new Card(Suit.DIAMONDS, Rank.TEN)];
    state.players[0].hand = [
      new Card(Suit.CLUBS, Rank.SEVEN),
      new Card(Suit.HEARTS, Rank.EIGHT),
      new Card(Suit.SPADES, Rank.NINE),
      new Card(Suit.SPADES, Rank.QUEEN),
      new Card(Suit.CLUBS, Rank.KING),
    ];
    const actions = getActionTypesForPlayer(0, state);
    expect(actions).toEqual(['KANNET_AND_DRAW']);
  });

  test('should allow JACK to be placed on any card but pending sevens', () => {
    const state = new GameState({ amountPlayers: 2 }).getState();
    const allCards = state.stack;
    for (const card of allCards) {
      state.stack = [card];
      state.players[0].hand = [new Card(Suit.CLUBS, Rank.JACK), new Card(Suit.DIAMONDS, Rank.JACK)];
      const actions = getActionTypesForPlayer(0, state);
      expect(actions).toEqual(['PLAY_JACK', 'KANNET_AND_DRAW']);
    }
  });

  test('should not allow JACK to be placed on pending sevens', () => {
    const state = new GameState({ amountPlayers: 2 }).getState();
    state.pendingSevens = 2;
    state.stack = [new Card(Suit.HEARTS, Rank.SEVEN)];
    state.players[0].hand = [new Card(Suit.CLUBS, Rank.JACK), new Card(Suit.DIAMONDS, Rank.JACK)];
    const actions = getActionTypesForPlayer(0, state);
    expect(actions).not.toContain(['PLAY_JACK']);
  });

  test('should only allow PLAY_SEVEN or ACCEPT_PENDING_SEVENS on pending sevens', () => {
    const state = new GameState({ amountPlayers: 2 }).getState();
    state.pendingSevens = 1;
    state.stack = [new Card(Suit.HEARTS, Rank.SEVEN)];
    state.players[0].hand = [
      new Card(Suit.CLUBS, Rank.JACK),
      new Card(Suit.DIAMONDS, Rank.JACK),
      new Card(Suit.DIAMONDS, Rank.SEVEN),
    ];
    const actions = getActionTypesForPlayer(0, state);
    expect(actions).toEqual(['PLAY_SEVEN', 'ACCEPT_PENDING_SEVENS']);
  });

  test('should only allow to play cards matching the next suit of a played jack', () => {
    const state = new GameState({ amountPlayers: 2 }).getState();
    state.stack = [new Card(Suit.HEARTS, Rank.JACK)];
    state.nextSuit = Suit.DIAMONDS;
    state.players[0].hand = [
      new Card(Suit.HEARTS, Rank.TEN),
      new Card(Suit.DIAMONDS, Rank.EIGHT),
      new Card(Suit.DIAMONDS, Rank.SEVEN),
    ];
    const actions = getActionTypesForPlayer(0, state);
    expect(actions).toContain('PLAY_EIGHT');
    expect(actions).toContain('PLAY_SEVEN');
    expect(actions).not.toContain(['PLAY_REGULAR_CARD']);
  });
});
