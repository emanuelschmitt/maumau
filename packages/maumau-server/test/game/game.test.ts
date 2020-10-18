import GameState from '../../src/game/game-state';
import Card from '../../src/models/card';
import Player from '../../src/models/player';
import { Suit, Rank, ActionType } from '../../src/types';

describe('game', () => {
  test('initalize should give players 7 cards', () => {
    const gameState = new GameState({
      players: [
        { id: '1', name: 'Johnny', isBot: false },
        { id: '2', name: 'Hugh', isBot: false },
      ],
    });
    for (const player of gameState.getState().players) {
      expect(player.hand).toHaveLength(7);
    }
  });

  test('card stack should have 32 cards', () => {
    const gameState = new GameState({
      players: [
        { id: '1', name: 'Johnny', isBot: false },
        { id: '2', name: 'Hugh', isBot: false },
      ],
    });
    // @ts-ignore
    const allCards = gameState.initalizeCardStack();
    expect(allCards).toHaveLength(32);
  });

  test('initalize should have remaining cards in stack after cards are dealt', () => {
    let gameState = new GameState({
      players: [
        { id: '1', name: 'Johnny', isBot: false },
        { id: '2', name: 'Hugh', isBot: false },
      ],
    });
    expect(gameState.getState().stack).toHaveLength(18);
    gameState = new GameState({
      players: [
        { id: '1', name: 'Johnny', isBot: false },
        { id: '2', name: 'Hugh', isBot: false },
        { id: '3', name: 'Depp', isBot: false },
      ],
    });
    expect(gameState.getState().stack).toHaveLength(11);
    gameState = new GameState({
      players: [
        { id: '1', name: 'Hugh', isBot: false },
        { id: '2', name: 'Hughy', isBot: false },
        { id: '3', name: 'Isa', isBot: false },
        { id: '4', name: 'Malte', isBot: false },
      ],
    });
    expect(gameState.getState().stack).toHaveLength(8);
  });

  test('initialize game should throw when number of players is not between 2 and 4', () => {
    expect(
      () =>
        new GameState({
          players: [{ id: '1', name: 'Hugh', isBot: false }],
        }),
    ).toThrow();
    expect(
      () =>
        new GameState({
          players: [
            { id: '1', name: 'Hugh', isBot: false },
            { id: '2', name: 'Hughy', isBot: false },
          ],
        }),
    ).not.toThrow();
    expect(
      () =>
        new GameState({
          players: [
            { id: '1', name: 'Hugh', isBot: false },
            { id: '2', name: 'Hughy', isBot: false },
            { id: '3', name: 'Isa', isBot: false },
          ],
        }),
    ).not.toThrow();
    expect(
      () =>
        new GameState({
          players: [
            { id: '1', name: 'Hugh', isBot: false },
            { id: '2', name: 'Hughy', isBot: false },
            { id: '3', name: 'Isa', isBot: false },
            { id: '4', name: 'Malte', isBot: false },
          ],
        }),
    ).not.toThrow();
    expect(
      () =>
        new GameState({
          players: [
            { id: '1', name: 'Hugh', isBot: false },
            { id: '2', name: 'Hughy', isBot: false },
            { id: '3', name: 'Isa', isBot: false },
            { id: '4', name: 'Malte', isBot: false },
            { id: '5', name: 'Emma', isBot: false },
          ],
        }),
    ).toThrow();
  });

  test('should end game based on when player plays his last card', () => {
    const state = new GameState({
      players: [
        { id: '1', name: 'Hugh', isBot: false },
        { id: '2', name: 'Hughy', isBot: false },
      ],
    });
    const card = new Card(Suit.CLUBS, Rank.NINE);
    const player = new Player('1', 'John', false, [card]);

    state.setPartialState({
      players: [player],
      stack: [card],
      playersTurnIndex: 0,
    });

    expect(state.getState().gameEnded).toBeFalsy();

    state.dispatch({
      type: ActionType.PLAY_REGULAR_CARD,
      payload: card,
    });

    expect(state.getState().gameEnded).toBeTruthy();
  });

  test('should auto perform KANNET if player has no other option', () => {
    const state = new GameState({
      players: [
        { id: '1', name: 'Hugh', isBot: false },
        { id: '2', name: 'Hughy', isBot: false },
      ],
    });

    const clubsNine = new Card(Suit.CLUBS, Rank.NINE);
    const spadesTen = new Card(Suit.SPADES, Rank.TEN);
    const diamondQueen = new Card(Suit.DIAMONDS, Rank.QUEEN);

    const player = new Player('1', 'John', false, [diamondQueen]);

    state.setPartialState({
      players: [player, player],
      stack: [spadesTen, clubsNine],
      playersTurnIndex: 0,
    });

    state.dispatch({
      type: ActionType.KANNET_AND_DRAW,
    });

    expect(state.getState().players[0].hand).toHaveLength(2);
    expect(state.getState().playersTurnIndex).toBe(1);
  });

  test('should auto perform KANNET if player has no other option', () => {
    const state = new GameState({
      players: [
        { id: '1', name: 'Hugh', isBot: false },
        { id: '2', name: 'Hughy', isBot: false },
      ],
    });

    const clubsSeven = new Card(Suit.CLUBS, Rank.NINE);
    const spadesTen = new Card(Suit.SPADES, Rank.TEN);
    const diamondQueen = new Card(Suit.DIAMONDS, Rank.QUEEN);

    const player1 = new Player('1', 'John', false, [diamondQueen, clubsSeven]);
    const player2 = new Player('2', 'John', false, [spadesTen]);

    state.setPartialState({
      players: [player1, player2],
      stack: [spadesTen, clubsSeven],
      playersTurnIndex: 0,
    });

    state.dispatch({
      type: ActionType.PLAY_SEVEN,
      payload: clubsSeven,
    });

    expect(state.getState().players[1].hand).toHaveLength(3);
  });
});
