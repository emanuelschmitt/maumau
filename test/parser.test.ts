import { Action } from "../src/reducer";
import Card from "../src/card";
import { Suit } from "../src/suit";
import { Rank } from "../src/rank";
import { tryParseAndValidateMessage, Message } from "../src/parser";
import { ActionType } from "../src/action";

describe("parser", () => {
  test("should parse action message with card payload", async () => {
    const action: Action = {
      type: ActionType.PLAY_REGULAR_CARD,
      payload: new Card(Suit.CLUBS, Rank.ACE),
    };
    const message: Message = {
      playerId: 0,
      action: action
    }
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).toBeDefined();
  });

  test("should not parse action when sending rubbish string", async () => {
    const raw = JSON.stringify("abc");
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });

  test("should not parse action when sending rubbish message", async () => {
    const message = {
      playerId: 0,
      action: "xzy"
    }
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });

  test("should not parse action when sending rubbish action message", async () => {
    const action = {
      type: "def"
    };
    const message = {
      playerId: 0,
      action: action
    }
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });

  test("should not parse action when action is valid but payload is not", async () => {
    const action = {
      type: ActionType.PLAY_REGULAR_CARD,
      payload: null
    };
    const message = {
      playerId: 0,
      action: action
    }
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });
});
