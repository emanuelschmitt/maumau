import { ActionType } from './game/action-type';
import { State, Action } from './game/reducer';

export { ActionType } from './game/action-type';
export { default as Card } from './models/card';
export { default as Player } from './models/player';
export { Suit } from './models/suit';
export { Rank } from './models/rank';

export type IncomingMessage = {
  playerId: number;
  action: Action;
};

export type GameState = {
  state: State;
  possibleActions: Record<number, ActionType[]>;
};
