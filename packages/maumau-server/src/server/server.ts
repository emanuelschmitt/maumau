import ws from 'ws';

import { CustomSocket } from './websocket';

export default class Server {
  private readonly server: ws.Server;
  private readonly onMessage: (message: ws.Data) => void;

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
      console.log(`Remote player with IP ${ip} joined.`);

      ws.on('pong', () => {
        // console.log(`pong to IP ${ip}`);
        ws.isAlive = true;
      });

      ws.on('message', async (message) => {
        console.log('incoming message');
        this.onMessage(message);
      });

      ws.on('close', () => {
        console.log(`closed connection to IP ${ip}.`);
      });
    });
  }

  private addCloseHandler(): void {
    this.server.on('close', function close() {
      console.log('socket closed. cleaning up.');
    });
  }
}
