import { OutgoingMessage } from 'maumau-server/src/types';
import useWebsocket from 'react-use-websocket';

function tryParseMessage(message?: string): OutgoingMessage | null {
  try {
    return JSON.parse(message);
  } catch (err) {
    return null;
  }
}

function useConnection(url: string) {
  const { lastMessage, ...rest } = useWebsocket(url, { shouldReconnect: () => true });

  const parsedMessage = tryParseMessage(lastMessage?.data);
  const { state, possibleActions } = parsedMessage || {};

  return {
    state,
    possibleActions,
    ...rest,
  };
}

export default useConnection;
