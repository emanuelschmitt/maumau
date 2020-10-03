import { Action } from 'maumau-server/src/game/reducer';
import { useQuery, useMutation } from 'react-query';

import * as client from '../api/client';

import { useSessionContext } from './session-context';

function useGameStateQuery(args: { gameId?: string; userId: string }) {
  return useQuery(
    'game',
    () =>
      client.getGameState({
        gameId: args.gameId!,
        userId: args.userId,
      }),
    {
      refetchInterval: 500,
      enabled: Boolean(args.gameId),
    },
  );
}

function useSendGameAction(args: { gameId?: string; userId: string }) {
  return useMutation((action: Action) =>
    client.sendGameAction({
      gameId: args.gameId || '',
      userId: args.userId,
      action,
    }),
  );
}

function useGame() {
  const [session] = useSessionContext();
  const { data } = useGameStateQuery({
    userId: session.userId,
    gameId: session.sessionId,
  });
  const [sendAction] = useSendGameAction({
    userId: session.userId,
    gameId: session.sessionId,
  });

  return {
    state: data,
    // NOTE: have to do this because of shitty typings
    sendAction: (action: Action) => sendAction(action as any),
  };
}

export default useGame;
