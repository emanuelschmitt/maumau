import GameSessionService from '../../src/service/game-session';

describe('GameSessionService', () => {
  test('should expose functionality to add game sesseions', () => {
    const gameSessionService = new GameSessionService();
    gameSessionService.add('id', [
      { id: '1', name: 'Johnny' },
      { id: '2', name: 'Hugh' },
    ]);
    expect(gameSessionService.get('id')).toBeDefined();
  });

  test('should overwrite game session on same id', () => {
    const gameSessionService = new GameSessionService();
    const response = gameSessionService.add('id', [
      { id: '1', name: 'Johnny' },
      { id: '2', name: 'Hugh' },
    ]);
    const response2 = gameSessionService.add('id', [
      { id: '1', name: 'Johnny' },
      { id: '2', name: 'Hugh' },
    ]);
    expect(response).not.toBe(response2);
  });

  test('should return undefined on not available session', () => {
    const gameSessionService = new GameSessionService();
    expect(gameSessionService.get('id')).toBeUndefined();
  });
});
