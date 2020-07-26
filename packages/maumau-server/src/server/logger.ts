import pino from 'pino';

import { APP_NAME } from '../constants';

export const logger = pino({
  name: APP_NAME,
  level: 'debug',
  prettyPrint: {
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    colorize: true,
    ignore: 'pid,hostname,tags,name',
  },
});
