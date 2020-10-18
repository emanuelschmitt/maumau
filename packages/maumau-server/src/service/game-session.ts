import GameState from '../game/game-state';

export type Session = {
  id: string,
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

  public add(id: string, players: { id: string; name: string, isBot: boolean }[]): Session {
    const gameState = new GameState({ players });
    const session: Session = { id, gameState };

    this.sessions[id] = session;

    return session;
  }

  public get(id: string): Session | undefined {
    return this.sessions[id];
  }
}
