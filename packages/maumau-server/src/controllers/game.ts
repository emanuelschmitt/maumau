import { celebrate, Joi, Segments } from 'celebrate';
import express, { Request, Response } from 'express';

import { ClientState } from '../game/client-state-adapter';
import { Action } from '../game/reducer';
import { actionSchema } from '../game/validation';
import GameSessionService from '../service/game-session';
import BotController from './bot';

export default class GameController {
  public router = express.Router();
  public static basePath: string = '/game';
  private gameSessionService: GameSessionService;
  private botController: BotController;

  constructor(args: { gameSessionService: GameSessionService }) {
    this.gameSessionService = args.gameSessionService;
    this.botController = new BotController();
    this.initializeRoutes();
    this.configureBotController();
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

  private configureBotController() {
    this.botController.onBotPlaying = (sessionId: string, userId: string, action: Action) => {
      const session = this.gameSessionService.get(sessionId);
      if (!session) {
        throw "Session is undefined?";
      }
      const state = session.gameState.dispatchForPlayer(userId, action);
      console.log(JSON.stringify(state));
    };
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

    response.status(200).send({ message: 'ok' });

    const userId = request.headers['x-maumau-user-id'] as string;
    const state = session.gameState.dispatchForPlayer(userId, request.body);
    const player = state.players[state.playersTurnIndex];
    if (player.isBot) {
      this.botController.playAction(session);
    }
  };

  public getRouter() {
    return this.router;
  }
}
