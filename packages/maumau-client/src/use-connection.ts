import { OutgoingMessage, IncomingMessage } from 'maumau-server/src/types';
import useWebsocket from 'react-use-websocket';

function tryParseMessage(message?: string): OutgoingMessage | null {
  try {
    return JSON.parse(message || '');
  } catch (err) {
    return null;
  }
}

function useConnection(url: string) {
  const { lastMessage, sendJsonMessage, ...rest } = useWebsocket(url, { shouldReconnect: () => true });

  const parsedMessage = tryParseMessage(lastMessage?.data);
  const { state, possibleActions } = parsedMessage || {};

  const sendAction = (message: IncomingMessage) => sendJsonMessage(message);

  return {
    state,
    possibleActions,
    sendAction,
    ...rest,
  };
}

export default useConnection;
