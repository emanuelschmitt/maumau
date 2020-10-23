import GameState from '../../src/game/game-state';
import Card from '../../src/models/card';
import Player from '../../src/models/player';
import { Suit, Rank, ActionType } from '../../src/types';

describe('GameState', () => {
  test('should end game based on when player plays his last card', (done) => {
    const state = new GameState({
      players: [
        { id: '1', name: 'Hugh' },
        { id: '2', name: 'Hughy' },
      ],
    });
    const card = new Card(Suit.CLUBS, Rank.NINE);
    const player = new Player('1', 'John', undefined, [card]);

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

    done();
  });

  test('should auto perform KANNET if player has no other option', (done) => {
    const state = new GameState({
      players: [
        { id: '1', name: 'Hugh' },
        { id: '2', name: 'Hughy' },
      ],
    });

    const clubsNine = new Card(Suit.CLUBS, Rank.NINE);
    const spadesTen = new Card(Suit.SPADES, Rank.TEN);
    const diamondQueen = new Card(Suit.DIAMONDS, Rank.QUEEN);

    const player = new Player('1', 'John', undefined, [diamondQueen]);

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

    done();
  });

  test('should auto perform KANNET if player has no other option', (done) => {
    const state = new GameState({
      players: [
        { id: '1', name: 'Hugh' },
        { id: '2', name: 'Hughy' },
      ],
    });

    const clubsSeven = new Card(Suit.CLUBS, Rank.NINE);
    const spadesTen = new Card(Suit.SPADES, Rank.TEN);
    const diamondQueen = new Card(Suit.DIAMONDS, Rank.QUEEN);

    const player1 = new Player('1', 'John', undefined, [diamondQueen, clubsSeven]);
    const player2 = new Player('2', 'John', undefined, [spadesTen]);

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

    done();
  });
});
