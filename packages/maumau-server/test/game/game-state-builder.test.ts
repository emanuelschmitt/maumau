import GameStateBuilder from '../../src/game/game-state-builder';

describe('GameStateBuilder', () => {
  test('should build correct game state for 2 players', () => {
    const players = [
      {
        id: '1',
        name: 'Bert',
      },
      {
        id: '2',
        name: 'Berta',
      },
    ];

    const state = new GameStateBuilder().withPlayers(players).withCardStack().withDealtCards().build();
    expect(state.players).toHaveLength(2);
    expect(state.stack).toHaveLength(18);
    expect(state.nextSuit).toBeNull();
    expect(state.playersTurnIndex).toBe(0);

    // Players should get seven cards;
    for (const player of state.players) {
      expect(player.hand).toHaveLength(7);
    }
  });

  test('should build correct gamestate for 3 players', () => {
    const players = [
      {
        id: '1',
        name: 'Bert',
      },
      {
        id: '2',
        name: 'Berta',
      },
      {
        id: '3',
        name: 'Berto',
      },
    ];

    const state = new GameStateBuilder().withPlayers(players).withCardStack().withDealtCards().build();
    expect(state.stack).toHaveLength(11);

    // Players should get seven cards;
    for (const player of state.players) {
      expect(player.hand).toHaveLength(7);
    }
  });

  test('should build correct gamestate for 3 players', () => {
    const players = [
      {
        id: '1',
        name: 'Bert',
      },
      {
        id: '2',
        name: 'Berta',
      },
      {
        id: '3',
        name: 'Berto',
      },
      {
        id: '4',
        name: 'Bertini',
      },
    ];

    const state = new GameStateBuilder().withPlayers(players).withCardStack().withDealtCards().build();
    expect(state.stack).toHaveLength(8);

    // Players should get seven cards;
    for (const player of state.players) {
      expect(player.hand).toHaveLength(6);
    }
  });
});
