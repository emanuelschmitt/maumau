import GameSessionService from '../../src/service/game-session';

describe('GameSessionService', () => {
  test('should expose functionality to add game sesseions', () => {
    const gameSessionService = new GameSessionService();
    gameSessionService.add('id');
    expect(gameSessionService.get('id')).toBeDefined();
  });

  test('should overwrite game session on same id', () => {
    const gameSessionService = new GameSessionService();
    const response = gameSessionService.add('id');
    const response2 = gameSessionService.add('id');
    expect(response).not.toBe(response2);
  });

  test('should return undefined on not available session', () => {
    const gameSessionService = new GameSessionService();
    expect(gameSessionService.get('id')).toBeUndefined();
  });
});
