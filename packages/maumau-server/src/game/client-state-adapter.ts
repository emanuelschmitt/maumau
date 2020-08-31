import Card from '../models/card';

import { ActionType } from './action-type';
import { State } from './reducer';
import { getActionTypesForPlayer } from './rules';

export type Player = {
  id: string;
  name: string;
  hand: Card[];
  possibleActions: ActionType[];
};

export type Opponent = {
  id: string;
  name: string;
  handCount: number;
  isPlaying: boolean;
};

export type ClientState = {
  player: Player;
  opponents: Opponent[];
  topCard: Card;
} & Pick<State, 'pendingSevens' | 'nextSuit' | 'gameEnded'>;

export function getClientStateForPlayerId(playerId: string, state: State): ClientState {
  const player = state.players.find(({ id }) => id === playerId);
  if (!player) {
    throw new Error('player not found.');
  }

  const playerWithTurn = state.players[state.playersTurnIndex];
  const topCard = state.stack[state.stack.length - 1];

  return {
    player: {
      id: player.id,
      name: player.name,
      hand: player.hand,
      possibleActions: getActionTypesForPlayer(player.id, state),
    },
    opponents: state.players
      .filter((p) => p.id !== playerId)
      .map((p) => ({
        id: p.id,
        name: p.name,
        handCount: p.hand.length,
        isPlaying: playerWithTurn.id === p.id,
      })),
    gameEnded: state.gameEnded,
    nextSuit: state.nextSuit,
    pendingSevens: state.pendingSevens,
    topCard,
  };
}
