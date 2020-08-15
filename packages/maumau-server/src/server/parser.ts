import Joi from '@hapi/joi';

import { Action } from '../game/reducer';
import { actionSchema, cardSchema } from '../game/validation';
import { Card } from '../types';

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
