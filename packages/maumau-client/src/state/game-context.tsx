import axios from 'axios';
import { Action } from 'maumau-server/src/game/reducer';
import { GameState } from 'maumau-server/src/types';
import React from 'react';
import { useQuery, useMutation } from 'react-query';

import { useSessionContext } from './session-context';

function useGame() {
  const [session] = useSessionContext();

  const { data } = useQuery<GameState, 'game'>(
    'game',
    async () => {
      const response = await axios.get(`/api/game/${session.sessionId}`);
      return response.data;
    },
    { refetchInterval: 500, cacheTime: 0, enabled: Boolean(session.sessionId) },
  );

  const [sendAction] = useMutation(async (action: Action) => {
    const response = await axios.put(`/api/game/${session.sessionId}`, action);
    return response.data;
  });

  const { state, possibleActions } = data || {};

  return {
    state,
    possibleActions,
    sendAction,
  };
}

type ContextType = ReturnType<typeof useGame>;
const context = React.createContext<ContextType | null>(null);

export function useGameContext() {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error('please provide provider for game context');
  }
  return ctx;
}

export function GameProvider({ children }: React.PropsWithChildren<{}>) {
  const values = useGame();
  return <context.Provider value={values}>{children}</context.Provider>;
}
