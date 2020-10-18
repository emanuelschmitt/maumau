import chunk from 'lodash.chunk';
import { v4 as uuidv4 } from 'uuid';

import { logger } from '../server/logger';

/**
 * Why no Websockets?
 * - https://samsaffron.com/archive/2015/12/29/websockets-caution-required
 * - HTTP/2 is coming and then we can migrate to server push....

 * PUT pool/join/
  - endpoint to join the pool of players
  - send { name: string, id: string }, id is uuid
  - sends back a 204.

 * PUT pool/leave/:id 
  - endpoint to leave the pool of players
  - sends back a 204
  - 404 if id is not found.

 * GET  pool/status/:id
  - url param id = the id of the user
  - endpoint for a user to see his status.
 
 * matchmake <---- build groups of x players depending on last joined. (internal)

 * GET game/:uuid/ <- returns game state. { gameState, possibleActions }
 * POST game/:uuid/ <- send action to endpoint. { action, userId: uuid }
 */

type Pool = {
  [userId: string]: { name: string; joinedAt: number; sessionId?: string; lastSeen: number };
};
export type Status = 'UNJOINED' | 'JOINED' | 'MATCHED';

export const MATCHMAKER_REPEAT_INTERVAL_MS = 1000;
const AMOUNT_OF_PLAYERS = 2;
const CLEANUP_THRESHOLD_MS = 10000;

type onSessionCreateFn = (id: string, players: { id: string; name: string }[]) => void;

export default class MatchmakerService {
  private pool: Pool;
  private matchMakeInterval: number;
  private cleanupInterval: number;
  private onSessionCreate: onSessionCreateFn;

  constructor(args: { onSessionCreate: onSessionCreateFn }) {
    this.pool = {};
    this.onSessionCreate = args.onSessionCreate;
    this.start();
  }

  public joinPool({ id, name }: { id: string; name: string }): void {
    logger.debug(`Matchmaking: User ${id} joined the pool.`);
    this.pool[id] = { name, joinedAt: Date.now(), lastSeen: Date.now() };
  }

  public leavePool({ id }: { id: string }): void {
    logger.debug(`Matchmaking: User ${id} left the pool.`);
    delete this.pool[id];
  }

  public getStatusByUserId(userId: string): { sessionId: string | null; status: Status } {
    const exists = Boolean(this.pool[userId]);
    const sessionId = this.pool[userId]?.sessionId ?? null;

    if (!exists) {
      return { status: 'UNJOINED', sessionId };
    }

    this.updateLastSeen(userId);
    return { status: sessionId ? 'MATCHED' : 'JOINED', sessionId };
  }

  private updateLastSeen(userId: string): void {
    const user = this.pool[userId];
    this.pool[userId] = { ...user, lastSeen: Date.now() };
  }

  private matchmake() {
    const entriesWithoutSession = Object.entries(this.pool)
      .filter(([_, entry]) => !Boolean(entry.sessionId))
      .sort(([_, a], [__, b]) => a.joinedAt - b.joinedAt);

    const groups = chunk(entriesWithoutSession, AMOUNT_OF_PLAYERS);
    const groupsWithLength = groups.filter((g) => g.length === AMOUNT_OF_PLAYERS);

    for (const group of groupsWithLength) {
      const sessionId = uuidv4();
      const players: { id: string; name: string }[] = [];
      for (const [userId, user] of group) {
        this.pool[userId] = { ...user, sessionId };
        players.push({ id: userId, name: user.name });
        logger.debug(`Matchmaking: Assign user ${userId} to game ${sessionId}`);
      }
      this.onSessionCreate(sessionId, players);
    }
  }

  private cleanupPool() {
    for (const [id, user] of Object.entries(this.pool)) {
      const isTimedOut = Date.now() - user.lastSeen >= CLEANUP_THRESHOLD_MS;
      if (isTimedOut) {
        logger.debug(`Matchmaking: Remove user ${id} from pool.`);
        this.leavePool({ id });
      }
    }
  }

  public start(): void {
    this.matchMakeInterval = setInterval(this.matchmake.bind(this), MATCHMAKER_REPEAT_INTERVAL_MS);
    this.cleanupInterval = setInterval(this.cleanupPool.bind(this), MATCHMAKER_REPEAT_INTERVAL_MS);
  }

  public stop(): void {
    clearInterval(this.matchMakeInterval);
    clearInterval(this.cleanupInterval);
  }

  public getPool(): Pool {
    return this.pool;
  }
}
