import Matchmaker from '../../src/service/matchmaker';

describe('matchmaker', () => {
  test('should matchmake when two players are available', () => {
    const matchmaker = new Matchmaker();

    // @ts-ignore
    expect(matchmaker.sessions).toHaveLength(0);

    matchmaker.joinPool({ name: 'Hannes' });
    matchmaker.joinPool({ name: 'Johnny' });

    // @ts-ignore
    matchmaker.matchmake();

    // @ts-ignore
    expect(matchmaker.pool).toHaveLength(0);
    // @ts-ignore
    expect(matchmaker.sessions).toHaveLength(1);
  });

  test('should not matchmake when not enough people are available', () => {
    const matchmaker = new Matchmaker();

    // @ts-ignore
    expect(matchmaker.sessions).toHaveLength(0);

    matchmaker.joinPool({ name: 'Hannes' });

    // @ts-ignore
    matchmaker.matchmake();

    // @ts-ignore
    expect(matchmaker.pool).toHaveLength(1);
    // @ts-ignore
    expect(matchmaker.sessions).toHaveLength(0);
  });

  test('should not matchmake when not enough people are available', () => {
    const matchmaker = new Matchmaker();

    // @ts-ignore
    expect(matchmaker.sessions).toHaveLength(0);

    for (let i = 0; i < 13; i++) {
      matchmaker.joinPool({ name: `Playa ${i}` });
    }

    // @ts-ignore
    matchmaker.matchmake();

    // @ts-ignore
    expect(matchmaker.pool).toHaveLength(1);
    // @ts-ignore
    expect(matchmaker.sessions).toHaveLength(6);
  });

  test('should not matchmake when not enough people are available', () => {
    const matchmaker = new Matchmaker();

    // @ts-ignore
    expect(matchmaker.sessions).toHaveLength(0);

    for (let i = 0; i < 13; i++) {
      matchmaker.joinPool({ name: `Playa ${i}` });
    }

    // @ts-ignore
    matchmaker.matchmake();

    // @ts-ignore
    expect(matchmaker.sessions).toHaveLength(6);
  });
});
