import bodyParser from 'body-parser';
import express from 'express';

import PoolController from '../controllers/pool';
import ServerSideRenderController from '../controllers/ssr';
import MatchmakerService from '../service/matchmaker';

type Services = {
  matchmakerService: MatchmakerService;
};

export function createServer({ services }: { services: Services }) {
  const app = express();

  app.use(bodyParser.json());

  app.use(ServerSideRenderController.basePath, new ServerSideRenderController().getRouter());
  app.use(PoolController.basePath, new PoolController({ matchmakerService: services.matchmakerService }).getRouter());

  return app;
}
