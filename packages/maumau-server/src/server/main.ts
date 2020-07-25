import { initalizeGame } from '../game/game';
import { reducer } from '../game/reducer';
import { getPlayerRules } from '../game/rules';

import { tryParseAndValidateMessage } from './parser';
import WebSocketServer from './websocket-server';

async function main() {
  let gameState = initalizeGame(2);

  const server = new WebSocketServer({
    host: '0.0.0.0',
    port: 8080,
    onMessage: async (message) => {
      const validatedMessage = await tryParseAndValidateMessage(message.toString());
      if (!validatedMessage) {
        return;
      }

      // check if eligable to do action
      const playerRules = getPlayerRules(gameState);
      if (playerRules[validatedMessage.playerId].includes(validatedMessage.action.type)) {
        console.log('action allowed, performing...', validatedMessage.action.type);
        gameState = reducer(gameState, validatedMessage.action);
      }
    },
  });

  // apply all the connection handlers.
  server.start();

  // Send state to clients.
  setInterval(() => {
    server.broadcast((client) => {
      client.send(
        JSON.stringify({
          state: gameState,
          possibleActions: getPlayerRules(gameState),
        }),
      );
    });
  }, 200);

  console.log('Server started at 0.0.0.0:8080');
}

main().catch((err) => console.error(err));
