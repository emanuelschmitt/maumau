import { createStack, initalizeGame } from '../src/game/game';

describe('game', () => {
  test('initalize should give players 7 cards', () => {
    const gameState = initalizeGame();
    for (const player of gameState.players) {
      expect(player.hand).toHaveLength(7);
    }
  });

  test('card stack should have 32 cards', () => {
    const allCards = createStack();
    expect(allCards).toHaveLength(32);
  });

  test('initalize should have remaining cards in stack after cards are dealt', () => {
    let gameState = initalizeGame(2);
    expect(gameState.stack).toHaveLength(18);
    gameState = initalizeGame(3);
    expect(gameState.stack).toHaveLength(11);
    gameState = initalizeGame(4);
    expect(gameState.stack).toHaveLength(4);
  });

  test('initialize game should throw when number of players is not between 2 and 4', () => {
    expect(() => initalizeGame(1)).toThrow();
    expect(() => initalizeGame(2)).not.toThrow();
    expect(() => initalizeGame(3)).not.toThrow();
    expect(() => initalizeGame(4)).not.toThrow();
    expect(() => initalizeGame(5)).toThrow();
  });
});
