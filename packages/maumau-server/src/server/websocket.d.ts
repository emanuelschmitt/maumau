import WS from 'ws';

interface CustomSocket extends WS {
  isAlive: boolean;
}
