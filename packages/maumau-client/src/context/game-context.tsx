import React from 'react';

import useGame from './use-game';

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
