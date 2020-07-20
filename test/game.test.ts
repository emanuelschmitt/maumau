import { initalizeGame } from "../src/game";

describe("game", () => {
  test("initalize should give players 7 cards", () => {
    const gameState = initalizeGame();
    for (const player of gameState.players) {
      expect(player.hand).toHaveLength(7);
    }
  });

  test("initalize should have remaining cards in stack after cards are dealt", () => {
    const gameState = initalizeGame(3);
    expect(gameState.stack).toHaveLength(32 - 3 * 7);
  });

  test("initialize game should throw when number of players is not between 2 and 4", () => {
    expect(() => initalizeGame(1)).toThrow();
    expect(() => initalizeGame(2)).not.toThrow();
    expect(() => initalizeGame(3)).not.toThrow();
    expect(() => initalizeGame(4)).not.toThrow();
    expect(() => initalizeGame(5)).toThrow();
  })
});
