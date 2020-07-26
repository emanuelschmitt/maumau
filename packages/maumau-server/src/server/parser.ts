import Joi from '@hapi/joi';

import { Action } from '../game/reducer';
import { ActionType } from '../models/action';
import { Card } from '../types';

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

function reconstructClassInstances<K extends string>(input: Record<K, any>) {
  for (const key of Object.keys(input) as K[]) {
    if (typeof input[key] === 'object' && input[key] !== null) {
      if (validateCardObject(input[key])) {
        input[key] = Card.fromObject(input[key]);
      } else {
        reconstructClassInstances(input[key]);
      }
    }
  }
}

function validateCardObject(value: any) {
  const result = cardSchema.validate(value);
  return !Boolean(result.error || result.errors);
}

export async function tryParseAndValidateMessage(input: string): Promise<Message | undefined> {
  try {
    const parsed: Message = JSON.parse(input);
    await messageSchema.validateAsync(parsed);
    reconstructClassInstances(parsed);
    return parsed;
  } catch (err) {
    return undefined;
  }
}
