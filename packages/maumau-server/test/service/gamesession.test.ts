import GameSessionService from '../../src/service/game-session';

describe('GameSessionService', () => {
  test('should expose functionality to add game sesseions', (done) => {
    const gameSessionService = new GameSessionService();
    gameSessionService.add('id', {
      players: [
        { id: '1', name: 'Johnny' },
        { id: '2', name: 'Hugh' },
      ],
    });
    expect(gameSessionService.get('id')).toBeDefined();
    done();
  });

  test('should overwrite game session on same id', (done) => {
    const gameSessionService = new GameSessionService();
    const response = gameSessionService.add('id', {
      players: [
        { id: '1', name: 'Johnny' },
        { id: '2', name: 'Hugh' },
      ],
    });
    const response2 = gameSessionService.add('id', {
      players: [
        { id: '1', name: 'Johnny' },
        { id: '2', name: 'Hugh' },
      ],
    });
    expect(response).not.toBe(response2);
    done();
  });

  test('should return undefined on not available session', (done) => {
    const gameSessionService = new GameSessionService();
    expect(gameSessionService.get('id')).toBeUndefined();
    done();
  });
});
