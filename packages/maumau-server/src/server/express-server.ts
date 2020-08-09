import bodyParser from 'body-parser';
import express from 'express';

import PoolController from '../controllers/pool';
import MatchmakerService from '../service/matchmaker';

import { router } from './ssr-router';

type Services = {
  matchmakerService: MatchmakerService;
};

export function createServer({ services }: { services: Services }) {
  const app = express();

  app.use(bodyParser.json());

  app.use('/', router);
  app.use(PoolController.basePath, new PoolController({ matchmakerService: services.matchmakerService }).router);

  return app;
}
