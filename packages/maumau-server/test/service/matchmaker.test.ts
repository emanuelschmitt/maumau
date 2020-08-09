import { v4 as uuidv4 } from 'uuid';

import Matchmaker from '../../src/service/matchmaker';

beforeEach(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.clearAllTimers();
});

describe('matchmaker', () => {
  test('should matchmake two available players into one shared session', () => {
    const matchmaker = new Matchmaker();

    const player1 = { name: 'Hannes', id: uuidv4() };
    const player2 = { name: 'Johnny', id: uuidv4() };

    matchmaker.joinPool(player1);
    matchmaker.joinPool(player2);

    matchmaker.start();

    jest.runOnlyPendingTimers();

    expect(matchmaker.getSessionIdByUserId(player1.id)).toBeTruthy();
    expect(matchmaker.getSessionIdByUserId(player2.id)).toBeTruthy();
    expect(matchmaker.getSessionIdByUserId(player1.id)).toBe(matchmaker.getSessionIdByUserId(player2.id));
  });

  test('should not matchmake when not enough people are available', () => {
    const matchmaker = new Matchmaker();

    expect(Object.keys(matchmaker.getPool())).toHaveLength(0);

    const player1 = { name: 'John', id: uuidv4() };
    const player2 = { name: 'John', id: uuidv4() };

    matchmaker.joinPool(player1);
    matchmaker.joinPool(player2);

    matchmaker.start();

    matchmaker.leavePool(player2);

    jest.runOnlyPendingTimers();

    expect(Object.keys(matchmaker.getPool())).toHaveLength(1);
    expect(matchmaker.getSessionIdByUserId(player1.id)).toBeUndefined();
  });

  test('should matchmake available players to unique sessions', () => {
    const matchmaker = new Matchmaker();

    expect(Object.keys(matchmaker.getPool())).toHaveLength(0);

    const players = [];
    for (let i = 0; i < 13; i++) {
      const player = { name: `Playa ${i}`, id: uuidv4() };
      matchmaker.joinPool(player);
      players.push(player);
    }

    matchmaker.start();

    jest.runOnlyPendingTimers();

    expect(Object.keys(matchmaker.getPool())).toHaveLength(13);
    expect([
      ...new Set(
        Object.values(matchmaker.getPool())
          .map((entry) => entry.sessionId)
          .filter(Boolean),
      ),
    ]).toHaveLength(6);
  });

  test('should match sessions in chronolocial order by joinedAt timestamp', () => {
    const matchmaker = new Matchmaker();

    expect(Object.keys(matchmaker.getPool())).toHaveLength(0);

    const players = [];
    for (let i = 0; i < 13; i++) {
      const player = { name: `Playa ${i}`, id: uuidv4() };
      matchmaker.joinPool(player);
      players.push(player);
      jest.advanceTimersByTime(1000);
    }

    matchmaker.start();

    jest.runOnlyPendingTimers();

    expect(Object.keys(matchmaker.getPool())).toHaveLength(13);

    const timestamps = Object.values(matchmaker.getPool())
      .filter((entry) => Boolean(entry.sessionId))
      .map((entry) => entry.joinedAt);

    const sorted = timestamps.sort();

    expect(timestamps).toBe(sorted);
  });
});
