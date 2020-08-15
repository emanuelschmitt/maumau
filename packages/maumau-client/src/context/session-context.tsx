import React from 'react';

import useSession from './use-session';
export { ActionType } from './use-session';

type ContextType = ReturnType<typeof useSession>;
const context = React.createContext<ContextType | null>(null);

export function useSessionContext() {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error('please provide provider for session state context');
  }
  return ctx;
}

export function SessionProvider({ children }: React.PropsWithChildren<{}>) {
  const values = useSession();
  return <context.Provider value={values}>{children}</context.Provider>;
}
