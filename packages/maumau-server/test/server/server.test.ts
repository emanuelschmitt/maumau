import request from 'supertest';

import { createServer } from '../../src/server/server';
import { createServiceMocks } from '../mock';

const services = createServiceMocks();

describe('express-server', () => {
  describe('GET / should server sider render the maumau client', () => {
    test('should return rendered html', async (done) => {
      const app = createServer({
        services,
      });
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.text).toContain('<!DOCTYPE html>');

      done();
    });

    test('should contain client js bundle', async (done) => {
      const app = createServer({
        services,
      });
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.text).toContain('<script');

      done();
    });
  });
});
