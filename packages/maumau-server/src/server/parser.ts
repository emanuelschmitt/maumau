import Joi from '@hapi/joi';

import { Action } from '../game/reducer';
import { ActionType } from '../models/action';

const cardSchema = Joi.object({
  suit: Joi.string().required(),
  rank: Joi.string().required(),
});

const actionSchema = Joi.object({
  type: Joi.alternatives(
    ActionType.PLAY_REGULAR_CARD,
    ActionType.PLAY_EIGHT,
    ActionType.PLAY_SEVEN,
    ActionType.PLAY_JACK,
    ActionType.KANNET_AND_DRAW,
    ActionType.KANNET,
    ActionType.ACCEPT_PENDING_SEVENS,
  ).match('one'),
  payload: Joi.when('type', { is: ActionType.PLAY_REGULAR_CARD, then: cardSchema })
    .when('type', { is: ActionType.PLAY_EIGHT, then: cardSchema })
    .when('type', { is: ActionType.PLAY_SEVEN, then: cardSchema })
    .when('type', { is: ActionType.PLAY_JACK, then: Joi.object({ card: cardSchema, suit: Joi.string().required() }) })
    .when('type', { is: ActionType.KANNET_AND_DRAW, then: Joi.not().allow() })
    .when('type', { is: ActionType.KANNET, then: Joi.not().allow() })
    .when('type', { is: ActionType.ACCEPT_PENDING_SEVENS, then: Joi.not().allow() }),
});

const messageSchema = Joi.object({
  playerId: Joi.number().required(),
  action: actionSchema,
});

export type Message = {
  playerId: number;
  action: Action;
};

export async function tryParseAndValidateMessage(input: string): Promise<Message | undefined> {
  try {
    const parsed = JSON.parse(input);
    await messageSchema.validateAsync(parsed);
    return parsed;
  } catch (err) {
    return undefined;
  }
}
