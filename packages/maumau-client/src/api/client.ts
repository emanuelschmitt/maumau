import axios from 'axios';
import { Action } from 'maumau-server/src/game/reducer';
import { ClientState } from 'maumau-server/src/types';

export async function getGameState(args: { gameId: string; userId: string }): Promise<ClientState> {
  const response = await axios.get(`/api/game/${args.gameId}`, {
    headers: {
      'x-maumau-user-id': args.userId,
    },
  });
  return response.data;
}

export async function sendGameAction(args: { gameId: string; userId: string; action: Action }): Promise<void> {
  const repsonse = await axios.put(`/api/game/${args.gameId}`, args.action, {
    headers: {
      'x-maumau-user-id': args.userId,
    },
  });
  return repsonse.data;
}

export async function joinPool({ name, id }: { name: string; id: string }) {
  const response = await axios.put('/api/pool/join', { name, id });
  return response.data;
}

export async function leavePool(id: string) {
  const response = await axios.put('/api/pool/leave', { id });
  return response.data;
}

export async function getStatusByUserId(id: string) {
  const response = await axios.get(`/api/pool/status/${id}`);
  return response.data;
}
