import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import express, { Express } from 'express';
import request from 'supertest';
import { verify, deepEqual, reset, when } from 'ts-mockito';

import GameController from '../../src/controllers/game';
import { createServiceMocks, createGameStateMock } from '../mock';

const services = createServiceMocks();

function setUpServer(setup: (app: Express) => void) {
  const app = express();

  app.use(bodyParser.json());

  setup(app);

  app.use(errors());

  return app;
}

beforeEach(() => {
  reset(services.gameSessionServiceMock);
});

describe('PoolController', () => {
  describe('GET /game/:id', () => {
    test('200 should return client state of game', async () => {
      const app = setUpServer((app) => {
        app.use(
          GameController.basePath,
          new GameController({ gameSessionService: services.gameSessionService }).getRouter(),
        );
      });

      const gameId = 'ef16f874-e195-427b-af35-b843f79af966';
      const userId = '9ff53193-91ab-4b81-a1fa-4cb6c0269bed';

      const { gameState } = createGameStateMock();
      when(services.gameSessionServiceMock.get(gameId)).thenReturn({
        gameState: gameState,
      });
      const res = await request(app).get(`/game/${gameId}`).set('x-maumau-user-id', userId);

      expect(res.status).toBe(200);
      verify(services.gameSessionServiceMock.get(deepEqual(gameId))).once();
    });

    test('should return 400 when user id headers are not set', async () => {
      const app = setUpServer((app) => {
        app.use(
          GameController.basePath,
          new GameController({ gameSessionService: services.gameSessionService }).getRouter(),
        );
      });

      const gameId = 'ef16f874-e195-427b-af35-b843f79af966';

      const { gameState } = createGameStateMock();
      when(services.gameSessionServiceMock.get(gameId)).thenReturn({
        gameState: gameState,
      });
      const res = await request(app).get(`/game/${gameId}`);

      expect(res.status).toBe(400);
      verify(services.gameSessionServiceMock.get(deepEqual(gameId))).never();
    });

    test('should return 404 when game session is not found', async () => {
      const app = setUpServer((app) => {
        app.use(
          GameController.basePath,
          new GameController({ gameSessionService: services.gameSessionService }).getRouter(),
        );
      });

      const gameId = 'ef16f874-e195-427b-af35-b843f79af966';
      const userId = '9ff53193-91ab-4b81-a1fa-4cb6c0269bed';

      when(services.gameSessionServiceMock.get(gameId)).thenReturn(undefined);
      const res = await request(app).get(`/game/${gameId}`).set('x-maumau-user-id', userId);
      expect(res.status).toBe(404);
      verify(services.gameSessionServiceMock.get(deepEqual(gameId))).once();
    });
  });
});
