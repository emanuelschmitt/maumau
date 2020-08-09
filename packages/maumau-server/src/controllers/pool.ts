import { celebrate, Joi } from 'celebrate';
import express, { Request, Response } from 'express';

import MatchmakerService from '../service/matchmaker';

export default class PoolController {
  public router = express.Router();
  public static basePath: string = '/pool';
  private matchmakerService: MatchmakerService;

  constructor(args: { matchmakerService: MatchmakerService }) {
    this.matchmakerService = args.matchmakerService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(
      `/join`,
      celebrate({
        body: Joi.object({
          id: Joi.string().uuid().required(),
          name: Joi.string().required(),
        }),
      }),
      this.join,
    );
    this.router.put(
      `/leave`,
      celebrate({
        body: Joi.object({
          id: Joi.string().required(),
        }),
      }),
      this.leave,
    );
    this.router.get(
      `/status/:id`,
      celebrate({
        params: Joi.object({
          id: Joi.string().required(),
        }),
      }),
      this.status,
    );
  }

  private join = (request: Request<{}, {}, { id: string; name: string }>, response: Response) => {
    const { id, name } = request.body;
    this.matchmakerService.joinPool({ id, name });
    response.status(204).send();
  };

  private leave = (request: Request<{}, {}, { id: string }>, response: Response) => {
    const { id } = request.body;
    this.matchmakerService.leavePool({ id });
    response.status(204).send();
  };

  private status = (request: Request<{ id: string }>, response: Response) => {
    const { id } = request.params;
    const sessionId = this.matchmakerService.getSessionIdByUserId(id);
    response.status(200).send({ sessionId: sessionId ? sessionId : 'none' });
  };

  public getRouter() {
    return this.router;
  }
}
