import { initalizeGame } from "../src/game";
import { getActionTypesForPlayer } from "../src/rules";
import util from "util";

describe("rules", () => {
  test("should show available actions according to rules", () => {
    const state = initalizeGame(2);
    const actions = getActionTypesForPlayer(0, state);
    console.log("state", util.inspect(state, undefined, 5));
    console.log("actions", actions);
    // TODO: make nice cases here.
    expect(true).toBeTruthy();
  });
});
