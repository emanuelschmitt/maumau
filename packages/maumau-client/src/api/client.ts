import axios from 'axios';
import { Action } from 'maumau-server/src/game/reducer';
import { GameState } from 'maumau-server/src/types';

export async function getGameState(id: string): Promise<GameState> {
  const response = await axios.get(`/api/game/${id}`);
  return response.data;
}

export async function sendGameAction(id: string, action: Action) {
  const repsonse = await axios.put(`/api/game/${id}`, action);
  return repsonse.data;
}
