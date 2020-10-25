import GameState, { GameStateOptions } from '../game/game-state';

export type Session = {
  id: string;
  gameState: GameState;
};

type Sessions = {
  [id: string]: Session;
};

export default class GameSessionService {
  private sessions: Sessions;

  constructor() {
    this.sessions = {};
  }

  public add(id: string, options: GameStateOptions): Session {
    const gameState = new GameState(options);
    const session: Session = { id, gameState };

    this.sessions[id] = session;

    return session;
  }

  public get(id: string): Session | undefined {
    return this.sessions[id];
  }
}
