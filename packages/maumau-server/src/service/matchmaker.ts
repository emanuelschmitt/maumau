type Player = {
  name: string;
  joinedAt: number; // timestamp when joined
};

type Session = {
  id: string; // uuid
  players: Player[];
};

const MATCHMAKER_REPEAT_INTERVAL_MS = 1000;

export default class Matchmaker {
  private pool: Player[];
  private sessions: Session[];

  private interval: number;

  constructor() {
    this.pool = [];
    this.sessions = [];
    console.log('init');
  }

  public joinPool({ name }: { name: string }): void {
    console.log('joining');
    this.pool.push({ name, joinedAt: Date.now() });
  }

  public leavePool({ name }: { name: string }): void {
    this.pool = this.pool.filter((p) => p.name === name);
  }

  private matchmake() {
    const playersToRemove: Player[] = [];

    for (let i = 0; i < this.pool.length - 1; i = i + 2) {
      const playerA = this.pool[i];
      const playerB = this.pool[i + 1];

      if (playerA && playerB) {
        this.sessions.push({ id: String(Date.now()), players: [playerA, playerB] });
        playersToRemove.push(playerA);
        playersToRemove.push(playerB);
      }
    }

    const playerNamesToRemove = playersToRemove.map((p) => p.name);
    this.pool = this.pool.filter((p) => !playerNamesToRemove.includes(p.name));
  }

  public start(): void {
    this.interval = setInterval(this.matchmake.bind(this), MATCHMAKER_REPEAT_INTERVAL_MS);
  }

  public stop(): void {
    clearInterval(this.interval);
  }
}
