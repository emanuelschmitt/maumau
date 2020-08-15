import { celebrate, Joi } from 'celebrate';
import express, { Request, Response } from 'express';

import { Action } from '../game/reducer';
import { actionSchema } from '../game/validation';
import GameSessionService, { Session } from '../service/game-session';

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
        params: Joi.object({
          id: Joi.string().required(),
        }),
      }),
      this.get,
    );
    this.router.put(
      `/:id`,
      celebrate({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: actionSchema,
      }),
      this.send,
    );
  }

  private get = (request: Request<{ id: string }>, response: Response<Session | { message: string }>) => {
    const { id } = request.params;
    const session = this.gameSessionService.get(id);
    if (!session) {
      return response.status(404).send({ message: 'session not found' });
    }
    response.status(200).send(session);
  };

  private send = (request: Request<{ id: string }, Action>, response: Response<Session | { message: string }>) => {
    const { id } = request.params;
    const session = this.gameSessionService.get(id);
    if (!session) {
      return response.status(404).send({ message: 'session not found' });
    }

    session.gameState.dispatch(request.body);

    response.status(200).send(session);
  };

  public getRouter() {
    return this.router;
  }
}
