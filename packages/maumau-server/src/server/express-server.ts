import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import express from 'express';

import GameController from '../controllers/game';
import PoolController from '../controllers/pool';
import ServerSideRenderController from '../controllers/ssr';
import GameSessionService from '../service/game-session';
import MatchmakerService from '../service/matchmaker';

type Services = {
  matchmakerService: MatchmakerService;
  gameSessionService: GameSessionService;
};

function createAPIRouter({ services }: { services: Services }) {
  const router = express.Router();

  router.use(
    PoolController.basePath,
    new PoolController({ matchmakerService: services.matchmakerService }).getRouter(),
  );
  router.use(
    GameController.basePath,
    new GameController({ gameSessionService: services.gameSessionService }).getRouter(),
  );

  return router;
}

export function createServer({ services }: { services: Services }) {
  const app = express();

  app.use(bodyParser.json());

  app.use('/api', createAPIRouter({ services }));
  app.use(ServerSideRenderController.basePath, new ServerSideRenderController().getRouter());

  app.use(errors());

  return app;
}
