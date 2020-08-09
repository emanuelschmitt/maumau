import chunk from 'lodash.chunk';
import { v4 as uuidv4 } from 'uuid';

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
  [userId: string]: { name: string; joinedAt: number; sessionId?: string };
};

export const MATCHMAKER_REPEAT_INTERVAL_MS = 1000;
const AMOUNT_OF_PLAYERS = 2;

export default class MatchmakerService {
  private pool: Pool;
  private interval: number;

  constructor() {
    this.pool = {};
  }

  public joinPool({ id, name }: { id: string; name: string }): void {
    this.pool[id] = { name, joinedAt: Date.now() };
  }

  public leavePool({ id }: { id: string }): void {
    delete this.pool[id];
  }

  public getSessionIdByUserId(userId: string): string | undefined {
    return this.pool[userId]?.sessionId;
  }

  private matchmake() {
    const entriesWithoutSession = Object.entries(this.pool)
      .filter(([_, entry]) => !Boolean(entry.sessionId))
      .sort(([_, a], [__, b]) => a.joinedAt - b.joinedAt);

    const groups = chunk(entriesWithoutSession, AMOUNT_OF_PLAYERS);
    const groupsWithLength = groups.filter((g) => g.length === AMOUNT_OF_PLAYERS);

    for (const group of groupsWithLength) {
      const sessionId = uuidv4();
      for (const [userId, entry] of group) {
        this.pool[userId] = { ...entry, sessionId };
      }
    }
  }

  public start(): void {
    this.interval = setInterval(this.matchmake.bind(this), MATCHMAKER_REPEAT_INTERVAL_MS);
  }

  public stop(): void {
    clearInterval(this.interval);
  }

  public getPool(): Pool {
    return this.pool;
  }
}
