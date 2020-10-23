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
    const matchmaker = new Matchmaker({ onSessionCreate: () => null });

    const player1 = { name: 'Hannes', id: uuidv4(), playAgainstBot: false };
    const player2 = { name: 'Johnny', id: uuidv4(), playAgainstBot: false };

    matchmaker.joinPool(player1);
    matchmaker.joinPool(player2);

    matchmaker.start();

    jest.runOnlyPendingTimers();

    expect(matchmaker.getStatusByUserId(player1.id).status).toBe('MATCHED');
    expect(matchmaker.getStatusByUserId(player2.id).status).toBe('MATCHED');
    expect(matchmaker.getStatusByUserId(player1.id).status).toBe(matchmaker.getStatusByUserId(player2.id).status);

    matchmaker.stop();
  });

  test('should not matchmake when not enough people are available', () => {
    const matchmaker = new Matchmaker({ onSessionCreate: jest.fn() });

    expect(Object.keys(matchmaker.getPool())).toHaveLength(0);

    const player1 = { name: 'John', id: uuidv4(), playAgainstBot: false };
    const player2 = { name: 'John 2', id: uuidv4(), playAgainstBot: false };

    matchmaker.joinPool(player1);
    matchmaker.joinPool(player2);
    matchmaker.leavePool(player2);

    matchmaker.start();

    jest.runOnlyPendingTimers();

    expect(Object.keys(matchmaker.getPool())).toHaveLength(1);
    expect(matchmaker.getStatusByUserId(player1.id)).toMatchObject({ status: 'JOINED' });

    matchmaker.stop();
  });

  test('should matchmake available players to unique sessions', () => {
    const matchmaker = new Matchmaker({ onSessionCreate: jest.fn() });

    expect(Object.keys(matchmaker.getPool())).toHaveLength(0);

    const players = [];
    for (let i = 0; i < 13; i++) {
      const player = { name: `Playa ${i}`, id: uuidv4(), playAgainstBot: false };
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

    matchmaker.stop();
  });

  test('should match sessions in chronolocial order by joinedAt timestamp', () => {
    const matchmaker = new Matchmaker({ onSessionCreate: jest.fn() });

    expect(Object.keys(matchmaker.getPool())).toHaveLength(0);

    const players = [];
    for (let i = 0; i < 13; i++) {
      const player = { name: `Playa ${i}`, id: uuidv4(), playAgainstBot: false };
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

    matchmaker.stop();
  });
});
