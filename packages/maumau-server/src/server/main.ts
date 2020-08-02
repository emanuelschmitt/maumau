import GameState from '../game/game-state';
import { getPlayerRules } from '../game/rules';

import { createServer } from './express-server';
import { logger } from './logger';
import { tryParseAndValidateMessage } from './parser';
import WebSocketServer from './websocket-server';

async function main() {
  const port = 8080;

  const app = createServer();
  const server = app.listen(port, () => {
    logger.info(`Express server listening on port ${port}`);
  });

  const gameState = new GameState({ amountPlayers: 2 });
  const wss = new WebSocketServer({
    server,
    onMessage: async (message) => {
      const validatedMessage = await tryParseAndValidateMessage(message.toString());
      if (!validatedMessage) {
        return;
      }

      // check if eligable to do action
      const playerRules = getPlayerRules(gameState.getState());
      if (playerRules[validatedMessage.playerId].includes(validatedMessage.action.type)) {
        logger.debug('action allowed, performing...', validatedMessage.action.type);
        gameState.dispatch(validatedMessage.action);
      }
    },
  });

  // apply all the connection handlers.
  wss.start();

  // Send state to clients.
  setInterval(() => {
    wss.broadcast((client) => {
      client.send(
        JSON.stringify({
          state: gameState.getState(),
          possibleActions: getPlayerRules(gameState.getState()),
        }),
      );
    });
  }, 200);

  logger.info(`Server started at 0.0.0.0:${port}`);
}

main().catch((err) => console.error(err));
