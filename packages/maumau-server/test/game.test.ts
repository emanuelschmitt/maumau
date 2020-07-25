import GameState from '../src/game/game-state';

describe('game', () => {
  test('initalize should give players 7 cards', () => {
    const gameState = new GameState({ amountPlayers: 2 });
    for (const player of gameState.getState().players) {
      expect(player.hand).toHaveLength(7);
    }
  });

  test('card stack should have 32 cards', () => {
    const gameState = new GameState({ amountPlayers: 2 });
    // @ts-ignore
    const allCards = gameState.initalizeCardStack();
    expect(allCards).toHaveLength(32);
  });

  test('initalize should have remaining cards in stack after cards are dealt', () => {
    let gameState = new GameState({ amountPlayers: 2 });
    expect(gameState.getState().stack).toHaveLength(18);
    gameState = new GameState({ amountPlayers: 3 });
    expect(gameState.getState().stack).toHaveLength(11);
    gameState = new GameState({ amountPlayers: 4 });
    expect(gameState.getState().stack).toHaveLength(4);
  });

  test('initialize game should throw when number of players is not between 2 and 4', () => {
    expect(() => new GameState({ amountPlayers: 1 })).toThrow();
    expect(() => new GameState({ amountPlayers: 2 })).not.toThrow();
    expect(() => new GameState({ amountPlayers: 3 })).not.toThrow();
    expect(() => new GameState({ amountPlayers: 4 })).not.toThrow();
    expect(() => new GameState({ amountPlayers: 5 })).toThrow();
  });
});
