import { mock, instance } from 'ts-mockito';

import GameState from '../src/game/game-state';
import GameSessionService from '../src/service/game-session';
import MatchmakerService from '../src/service/matchmaker';

export function createServiceMocks() {
  const gameSessionServiceMock = mock(GameSessionService);
  const gameSessionService = instance(gameSessionServiceMock);

  const matchmakerServiceMock = mock(MatchmakerService);
  const matchmakerService = instance(matchmakerServiceMock);

  return {
    gameSessionService,
    gameSessionServiceMock,
    matchmakerService,
    matchmakerServiceMock,
  };
}

export function createGameStateMock() {
  const gameStateMock = mock(GameState);
  const gameState = instance(gameStateMock);

  return {
    gameState,
    gameStateMock,
  };
}
