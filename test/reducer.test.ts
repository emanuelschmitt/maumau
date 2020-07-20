import { State, reducer } from "../src/reducer";
import { initalizeGame } from "../src/game";

describe("reducer", () => {
  describe("when PLAY_REGULAR_CARD action", () => {
    const state = initalizeGame(2);
    const cardToPlay = state.players[state.playersTurnIndex].hand[0];
    const newState = reducer(state, {
      type: "PLAY_REGULAR_CARD",
      payload: cardToPlay,
    });

    test("should remove card from current players hand", () => {
      expect(
        newState.players[state.playersTurnIndex].hand.includes(cardToPlay)
      ).toBeFalsy();
    });

    test("should set next player", () => {
      expect(newState.playersTurnIndex).toEqual(state.playersTurnIndex + 1);
    });

    test("should append card to stack", () => {
      expect(newState.stack.includes(cardToPlay)).toBeTruthy();
    });
  });
});
