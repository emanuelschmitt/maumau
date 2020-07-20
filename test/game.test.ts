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
});
