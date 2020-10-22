import GameState, { GameStateOptions } from '../game/game-state';

export type Session = {
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
    const session: Session = { gameState };

    this.sessions[id] = session;

    return session;
  }

  public get(id: string): Session | undefined {
    return this.sessions[id];
  }
}
