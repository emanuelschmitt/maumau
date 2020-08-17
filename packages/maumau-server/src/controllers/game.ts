import { celebrate, Joi } from 'celebrate';
import express, { Request, Response } from 'express';

import { ActionType } from '../game/action-type';
import { Action, State } from '../game/reducer';
import { getPlayerRules } from '../game/rules';
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
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      }),
      this.get,
    );
    this.router.put(
      `/:id`,
      celebrate({
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        body: actionSchema,
      }),
      this.send,
    );
  }

  private get = (
    request: Request<{ id: string }>,
    response: Response<{ state: State; possibleActions: Record<string, ActionType[]> } | { message: string }>,
  ) => {
    const { id } = request.params;
    const session = this.gameSessionService.get(id);
    if (!session) {
      return response.status(404).send({ message: 'session not found' });
    }

    response.status(200).send({
      state: session.gameState.getState(),
      possibleActions: getPlayerRules(session.gameState.getState()),
    });
  };

  private send = (
    request: Request<{ id: string }, Action>,
    response: Response<{ state: State; possibleActions: Record<string, ActionType[]> } | { message: string }>,
  ) => {
    const { id } = request.params;
    const session = this.gameSessionService.get(id);

    if (!session) {
      return response.status(404).send({ message: 'session not found' });
    }

    const state = session.gameState.dispatch(request.body);
    response.status(200).send({
      state,
      possibleActions: getPlayerRules(state),
    });
  };

  public getRouter() {
    return this.router;
  }
}
