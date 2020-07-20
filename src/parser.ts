import joi from "@hapi/joi";
import { Action } from "./reducer";

const cardSchema = joi.object({
  suit: joi.string().required(),
  rank: joi.string().required(),
});

const actionSchema = joi.alternatives().try(
  joi.object({
    type: joi.string().allow("PLAY_REGULAR_CARD"),
    payload: cardSchema,
  }),
  joi.object({
    type: joi.string().allow("PLAY_EIGHT"),
    payload: cardSchema,
  }),
  joi.object({
    type: joi.string().allow("PLAY_SEVEN"),
    payload: cardSchema,
  }),
  joi.object({
    type: joi.string().allow("PLAY_JACK"),
    payload: joi.object({ card: cardSchema, suit: joi.string().required() }),
  }),
  joi.object({
    type: joi.string().allow("KANNET_AND_DRAW"),
  }),
  joi.object({
    type: joi.string().allow("KANNET"),
  }),
  joi.object({
    type: joi.string().allow("ACCEPT_PENDING_SEVENS"),
  })
);

const messageSchema = joi.object({
  playerId: joi.number().required(),
  action: actionSchema,
});

type Message = {
  playerId: number;
  action: Action;
};

export async function tryParseAndValidateMessage(
  input: string
): Promise<Message | undefined> {
  try {
    const parsed = JSON.parse(input);
    await messageSchema.validateAsync(parsed);
    return parsed;
  } catch (err) {
    console.error(`failed to parse action`);
    console.error(err);
  }
}
