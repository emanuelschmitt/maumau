import GameSessionService from '../service/game-session';
import MatchmakerService from '../service/matchmaker';

import { logger } from './logger';
import { createServer } from './server';

async function main() {
  const port = 8080;

  const gameSessionService = new GameSessionService();
  const matchmakerService = new MatchmakerService({
    onSessionCreate: (id) => {
      gameSessionService.add(id);
    },
  });

  const app = createServer({ services: { matchmakerService, gameSessionService } });

  app.listen(port, () => {
    logger.info(`Express server listening on port ${port}`);
  });

  logger.info(`Server started at 0.0.0.0:${port}`);
}

main().catch((err) => console.error(err));
