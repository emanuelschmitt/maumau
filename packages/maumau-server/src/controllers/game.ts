import { celebrate, Joi } from 'celebrate';
import express, { Request, Response } from 'express';

import { ClientState } from '../game/client-state-adapter';
import { Action } from '../game/reducer';
import { actionSchema } from '../game/validation';
import GameSessionService from '../service/game-session';

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
        headers: Joi.object({
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
        headers: Joi.object({
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
    const session = this.gameSessionService.get(id);

    if (!session) {
      return response.status(404).send({ message: 'session not found' });
    }

    const userId = request.headers['x-maumau-user-id'] as string;
    session.gameState.dispatchForPlayer(userId, request.body);

    response.status(200).send({ message: 'ok' });
  };

  public getRouter() {
    return this.router;
  }
}
