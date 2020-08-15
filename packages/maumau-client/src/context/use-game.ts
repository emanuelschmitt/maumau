import { Action, State } from 'maumau-server/src/game/reducer';
import { useQuery, useMutation } from 'react-query';

import * as client from '../api/client';

import { useSessionContext } from './session-context';

function useGameStateQuery(id: string = '') {
  return useQuery('game', () => client.getGameState(id!), {
    refetchInterval: 500,
    cacheTime: 0,
    enabled: Boolean(id),
  });
}

function useSendGameAction(id: string = '') {
  return useMutation((action: Action) => client.sendGameAction(id, action));
}

function enhanceGameState(state?: State) {
  if (!state) {
    return;
  }

  const { players, playersTurnIndex, stack } = state;
  const currentPlayer = players[playersTurnIndex];
  const topCard = stack[stack.length - 1];

  return {
    ...state,
    currentPlayer,
    topCard,
  };
}

function useGame() {
  const [session] = useSessionContext();
  const { data } = useGameStateQuery(session.sessionId);
  const [sendAction] = useSendGameAction(session.sessionId);

  const { state, possibleActions } = data || {};

  return {
    state: enhanceGameState(state),
    possibleActions,
    // NOTE: have to do this because of shitty typings
    sendAction: (action: Action) => sendAction(action as any),
  };
}

export default useGame;
