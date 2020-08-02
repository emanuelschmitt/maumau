import { Action } from '../../src/game/reducer';
import { ActionType } from '../../src/models/action-type';
import Card from '../../src/models/card';
import { Rank } from '../../src/models/rank';
import { Suit } from '../../src/models/suit';
import { Message, tryParseAndValidateMessage } from '../../src/server/parser';

describe('parser', () => {
  test('should parse action message with card payload', async () => {
    const action: Action = {
      type: ActionType.PLAY_REGULAR_CARD,
      payload: new Card(Suit.CLUBS, Rank.ACE),
    };
    const message: Message = {
      playerId: 0,
      action: action,
    };
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).toBeDefined();
  });

  test('should not parse action when sending rubbish string', async () => {
    const raw = JSON.stringify('abc');
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });

  test('should not parse action when sending rubbish message', async () => {
    const message = {
      playerId: 0,
      action: 'xzy',
    };
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });

  test('should not parse action when sending rubbish action message', async () => {
    const action = {
      type: 'def',
    };
    const message = {
      playerId: 0,
      action: action,
    };
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });

  test('should not parse action when action is valid but payload is not', async () => {
    const action = {
      type: ActionType.PLAY_REGULAR_CARD,
      payload: null,
    };
    const message = {
      playerId: 0,
      action: action,
    };
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).not.toBeDefined();
  });

  test('should parse incoming card object to class instances', async () => {
    const action = {
      type: ActionType.PLAY_REGULAR_CARD,
      payload: { suit: Suit.CLUBS, rank: Rank.KING },
    };
    const message = {
      playerId: 0,
      action: action,
    };
    const raw = JSON.stringify(message);
    const validated = await tryParseAndValidateMessage(raw);
    expect(validated).toBeDefined();

    if (validated?.action.type !== ActionType.PLAY_REGULAR_CARD) {
      fail('invalid state');
    }

    expect(validated.action.payload).toBeInstanceOf(Card);
  });
});
