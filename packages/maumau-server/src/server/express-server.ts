import express from 'express';

import { router } from './ssr-router';

export function createServer() {
  const app = express();

  app.use('/', router);

  return app;
}
