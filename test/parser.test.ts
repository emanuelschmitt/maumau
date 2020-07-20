import { Action } from "../src/reducer";
import Card from "../src/card";
import { Suit } from "../src/suit";
import { Rank } from "../src/rank";
import { tryParseAndValidateMessage } from "../src/parser";

describe("parser", () => {
  test("should parse action message with card payload", async () => {
    const action: Action = {
      type: "PLAY_REGULAR_CARD",
      payload: new Card(Suit.CLUBS, Rank.ACE),
    };

    const raw = JSON.stringify(action);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).toBeDefined();
  });

  test("should not parse action when sending rubbish", async () => {
    const action = 'aacb';

    const raw = JSON.stringify(action);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });
});
