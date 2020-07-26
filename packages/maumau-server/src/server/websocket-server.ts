import ws from 'ws';

import { logger } from './logger';
import { CustomSocket } from './websocket';

export default class WebSocketServer {
  private readonly server: ws.Server;
  private readonly onMessage: (message: ws.Data) => void | Promise<void>;

  constructor({ onMessage, ...options }: { onMessage: (message: ws.Data) => void } & ws.ServerOptions) {
    this.server = new ws.Server(options);
    this.onMessage = onMessage;
  }

  public start() {
    this.addConnectionHandler();
    this.addCloseHandler();
  }

  public broadcast(onBroadcast: (client: ws) => void) {
    for (const client of Array.from(this.server.clients)) {
      if ((client as CustomSocket).isAlive === false) {
        return client.terminate();
      }

      onBroadcast(client);

      (client as CustomSocket).isAlive = false;
      client.ping();
    }
  }

  private addConnectionHandler() {
    this.server.on('connection', (ws: CustomSocket, req) => {
      const ip = req.socket.remoteAddress;
      logger.info(`Remote player with IP ${ip} joined.`);

      ws.on('pong', () => {
        // logger.debug(`pong to IP ${ip}`);
        ws.isAlive = true;
      });

      ws.on('message', async (message) => {
        logger.debug('incoming message');
        await this.onMessage(message);
      });

      ws.on('close', () => {
        logger.info(`closed connection to IP ${ip}.`);
      });
    });
  }

  private addCloseHandler(): void {
    this.server.on('close', function close() {
      logger.info('socket closed. cleaning up.');
    });
  }
}
