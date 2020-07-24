import { State, Action } from './game/reducer';
import { ActionType } from './models/action';

export { ActionType } from './models/action';
export { default as Card } from './models/card';
export { default as Player } from './models/player';
export { Suit } from './models/suit';
export { Rank } from './models/rank';

export type IncomingMessage = {
  playerId: number;
  action: Action;
};

export type OutgoingMessage = {
  state: State;
  possibleActions: Record<number, ActionType[]>;
};
