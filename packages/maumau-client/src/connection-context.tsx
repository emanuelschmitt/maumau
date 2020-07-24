import React from 'react';

import useConnection from './use-connection';

const context = React.createContext<ReturnType<typeof useConnection> | null>(null);

type Props = {
  url: string;
  children: React.ReactNode;
};

export function ConnectionContextProvider({ url, children }: Props) {
  const value = useConnection(url);
  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useConnectionContext() {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error('provide <WsContextProvider />');
  }
  return ctx;
}
