import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import express, { Express } from 'express';
import request from 'supertest';
import { verify, deepEqual, reset, when } from 'ts-mockito';
import { v4 as uuidV4 } from 'uuid';

import PoolController from '../../src/controllers/pool';
import { createServiceMocks } from '../mock';

const services = createServiceMocks();

function setUpServer(setup: (app: Express) => void) {
  const app = express();

  app.use(bodyParser.json());

  setup(app);

  app.use(errors());

  return app;
}

beforeEach(() => {
  reset(services.matchmakerServiceMock);
});

describe('PoolController', () => {
  describe('PUT /pool/join', () => {
    test('200 should join pool with paylaod', async (done) => {
      const app = setUpServer((app) => {
        app.use(
          PoolController.basePath,
          new PoolController({
            matchmakerService: services.matchmakerService,
          }).getRouter(),
        );
      });

      const payload = { id: uuidV4(), name: 'Johnny' };
      const res = await request(app).put('/pool/join').send(payload);

      expect(res.status).toBe(200);
      verify(services.matchmakerServiceMock.joinPool(deepEqual(payload))).once();

      done();
    });

    test('400 should fail on invalid paylaod', async (done) => {
      const app = setUpServer((app) => {
        app.use(
          PoolController.basePath,
          new PoolController({
            matchmakerService: services.matchmakerService,
          }).getRouter(),
        );
      });

      const payload = { id: 'id', name: 'Johnny' };
      const res = await request(app).put('/pool/join').send(payload);

      expect(res.status).toBe(400);
      verify(services.matchmakerServiceMock.joinPool(deepEqual(payload))).never();

      done();
    });
  });

  describe('PUT /pool/leave', () => {
    test('200 should lave pool with id', async (done) => {
      const app = setUpServer((app) => {
        app.use(
          PoolController.basePath,
          new PoolController({
            matchmakerService: services.matchmakerService,
          }).getRouter(),
        );
      });

      const payload = { id: uuidV4() };
      const res = await request(app).put('/pool/leave').send(payload);

      expect(res.status).toBe(200);
      verify(services.matchmakerServiceMock.leavePool(deepEqual(payload))).once();

      done();
    });
  });

  describe('PUT /pool/status/:id', () => {
    test('200 should return player status', async (done) => {
      const app = setUpServer((app) => {
        app.use(
          PoolController.basePath,
          new PoolController({
            matchmakerService: services.matchmakerService,
          }).getRouter(),
        );
      });

      const payload = { id: uuidV4() };
      when(services.matchmakerServiceMock.getStatusByUserId(payload.id)).thenReturn({
        sessionId: '1',
        status: 'JOINED',
      });

      const res = await request(app).get(`/pool/status/${payload.id}`);
      expect(res.status).toBe(200);
      verify(services.matchmakerServiceMock.getStatusByUserId(payload.id)).once();

      done();
    });
  });
});
