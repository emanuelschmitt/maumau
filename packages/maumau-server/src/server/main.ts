import express from 'express';

import GameState from '../game/game-state';
import { getPlayerRules } from '../game/rules';

import { logger } from './logger';
import { tryParseAndValidateMessage } from './parser';
import { createSSRRouter } from './ssr-router';
import WebSocketServer from './websocket-server';

async function main() {
  const port = 8080;

  const server = express().use('/', createSSRRouter()).listen(port);

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

  logger.info('Server started at 0.0.0.0:8080');
}

main().catch((err) => console.error(err));
