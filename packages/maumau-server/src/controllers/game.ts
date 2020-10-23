import { celebrate, Joi, Segments } from 'celebrate';
import express, { Request, Response } from 'express';

import { ClientState } from '../game/client-state-adapter';
import { Action } from '../game/reducer';
import { actionSchema } from '../game/validation';
import GameSessionService from '../service/game-session';
import { Card } from '../types';

export default class GameController {
  public router = express.Router();
  public static basePath: string = '/game';
  private gameSessionService: GameSessionService;

  constructor(args: { gameSessionService: GameSessionService }) {
    this.gameSessionService = args.gameSessionService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `/:id`,
      celebrate({
        [Segments.HEADERS]: Joi.object({
          'x-maumau-user-id': Joi.string().uuid().required(),
        }).unknown(true),
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      }),
      this.get,
    );
    this.router.put(
      `/:id`,
      celebrate({
        [Segments.HEADERS]: Joi.object({
          'x-maumau-user-id': Joi.string().uuid().required(),
        }).unknown(true),
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        body: actionSchema,
      }),
      this.send,
    );
  }

  private get = (request: Request<{ id: string }>, response: Response<ClientState | { message: string }>) => {
    const { id } = request.params;
    const session = this.gameSessionService.get(id);
    if (!session) {
      return response.status(404).send({ message: 'session not found' });
    }
    const userId = request.headers['x-maumau-user-id'] as string;
    const state = session.gameState.getClientStateForPlayer(userId);
    response.status(200).send(state);
  };

  private send = (request: Request<{ id: string }, Action>, response: Response<{ message: string }>) => {
    const { id } = request.params;
    const action = request.body;

    const session = this.gameSessionService.get(id);

    if (!session) {
      return response.status(404).send({ message: 'session not found' });
    }
    const userId = request.headers['x-maumau-user-id'] as string;

    const sanitizedAction = recreateCardInstances(action);
    session.gameState.dispatchForPlayer(userId, sanitizedAction);
    response.status(200).send({ message: 'ok' });
  };

  public getRouter() {
    return this.router;
  }
}

function recreateCardInstances(input: { [x: string]: any }): Action {
  console.log('input..', input);
  const isCardObject = (input: { [x: string]: any }): input is Card => input.suit && input.rank;
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'object') {
      recreateCardInstances(value);
    }
    if (isCardObject(value)) {
      input[key] = new Card(value.suit, value.rank);
    }
  }
  return input as Action;
}
