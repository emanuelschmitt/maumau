import React from 'react';

import useSessionState from './use-session-state';
export { ActionType } from './use-session-state';

type ContextType = ReturnType<typeof useSessionState>;
const context = React.createContext<ContextType | null>(null);

export function useSessionStateContext() {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error('please provide provider for session state context');
  }
  return ctx;
}

export function SessionStateProvider({ children }: React.PropsWithChildren<{}>) {
  const values = useSessionState();
  return <context.Provider value={values}>{children}</context.Provider>;
}
