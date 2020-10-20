import { celebrate, Joi } from 'celebrate';
import express, { Request, Response } from 'express';

import MatchmakerService, { Status } from '../service/matchmaker';

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

  private join = (
    request: Request<{}, {}, { id: string; name: string; playAgainstBot: boolean | undefined }>,
    response: Response<{ status: Status }>,
  ) => {
    const { id, name, playAgainstBot } = request.body;

    // Compatibilty with old clients:
    let willPlayAgainstBot = playAgainstBot;
    if (willPlayAgainstBot == undefined) {
      willPlayAgainstBot = true;
    }

    this.matchmakerService.joinPool({ id, name, playAgainstBot: willPlayAgainstBot });
    response.status(200).send({ status: 'JOINED' });
  };

  private leave = (request: Request<{}, {}, { id: string }>, response: Response<{ status: Status }>) => {
    const { id } = request.body;
    this.matchmakerService.leavePool({ id });
    response.status(200).send({ status: 'UNJOINED' });
  };

  private status = (
    request: Request<{ id: string }>,
    response: Response<{ status: Status; sessionId: string | null }>,
  ) => {
    const { id } = request.params;
    const status = this.matchmakerService.getStatusByUserId(id);
    response.status(200).send(status);
  };

  public getRouter() {
    return this.router;
  }
}
