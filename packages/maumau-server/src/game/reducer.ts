import Card, { IncomingCard } from '../models/card';
import Player from '../models/player';
import { Suit } from '../models/suit';
import { logger } from '../server/logger';

import { ActionType } from './action-type';

export enum GameEndReason {
  PLAYER_WON = 'PLAYER_WON',
  DISCONNECT = 'DISCONNECT',
}

export type GameEnd = {
  type: GameEndReason;
  id: string;
};

export type State = {
  players: Player[];
  playersTurnIndex: number;
  stack: Card[];
  nextSuit: Suit | null;
  pendingSevens: number | null; // Case when seven is pending and user has to drawn x cards
  hasDrawnCard: boolean; // Case where kannet and has to take card
  gameEnded: GameEnd | null;
};

export type Action =
  | { type: ActionType.PLAY_REGULAR_CARD; payload: IncomingCard }
  | { type: ActionType.PLAY_EIGHT; payload: IncomingCard }
  | { type: ActionType.PLAY_SEVEN; payload: IncomingCard }
  | { type: ActionType.PLAY_JACK; payload: { card: IncomingCard; suit: Suit } }
  | { type: ActionType.KANNET_AND_DRAW }
  | { type: ActionType.KANNET }
  | { type: ActionType.ACCEPT_PENDING_SEVENS }
  | { type: ActionType.END_GAME; payload: { type: GameEndReason; id: string } };

export function reducer(state: State, action: Action): State {
  const { players, playersTurnIndex, stack } = state;

  logger.debug(`Reducer: Emiting action ${action.type}`);

  switch (action.type) {
    case ActionType.PLAY_REGULAR_CARD: {
      const player = players[playersTurnIndex];
      const incomingCard = Card.fromObject(action.payload);
      const newHand = player.hand.filter((card) => !card.isEqual(incomingCard));
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, Card.fromObject(action.payload)],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        hasDrawnCard: false,
        nextSuit: null,
        pendingSevens: null,
        gameEnded: null,
      };
    }

    case ActionType.PLAY_EIGHT: {
      const player = players[playersTurnIndex];
      const incomingCard = Card.fromObject(action.payload);
      const newHand = player.hand.filter((card) => !card.isEqual(incomingCard));
      players[playersTurnIndex].hand = newHand;

      return {
        ...state,
        players,
        stack: [...stack, incomingCard],
        playersTurnIndex: (playersTurnIndex + 2) % players.length,
        hasDrawnCard: false,
        nextSuit: null,
        gameEnded: null,
      };
    }

    case ActionType.PLAY_SEVEN: {
      const player = players[playersTurnIndex];
      const incomingCard = Card.fromObject(action.payload);
      const newHand = player.hand.filter((card) => !card.isEqual(incomingCard));
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, incomingCard],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        pendingSevens: (state?.pendingSevens ?? 0) + 1,
        hasDrawnCard: false,
        nextSuit: null,
        gameEnded: null,
      };
    }

    case ActionType.PLAY_JACK: {
      const player = players[playersTurnIndex];
      const incomingCard = Card.fromObject(action.payload.card);
      const newHand = player.hand.filter((card) => !card.isEqual(incomingCard));
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, incomingCard],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        pendingSevens: null,
        hasDrawnCard: false,
        nextSuit: action.payload.suit,
        gameEnded: null,
      };
    }

    case ActionType.KANNET_AND_DRAW: {
      const firstCard = stack[0]; // stack will never be empty
      if (!firstCard) {
        throw new Error('stack is unexpectidly empty');
      }

      const player = players[playersTurnIndex];
      players[playersTurnIndex].hand = [...player.hand, firstCard];

      return {
        players,
        stack: stack.slice(1),
        hasDrawnCard: true,
        nextSuit: state.nextSuit,
        pendingSevens: null,
        playersTurnIndex,
        gameEnded: null,
      };
    }

    case ActionType.KANNET: {
      return {
        players,
        hasDrawnCard: false,
        nextSuit: state.nextSuit,
        pendingSevens: null,
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        stack,
        gameEnded: null,
      };
    }

    case ActionType.ACCEPT_PENDING_SEVENS: {
      const numberOfCards = (state?.pendingSevens ?? 0) * 2;
      const cardsToDraw = stack.slice(0, numberOfCards);
      const newStack = stack.slice(numberOfCards);

      const player = players[playersTurnIndex];
      players[playersTurnIndex].hand = [...player.hand, ...cardsToDraw];

      return {
        players,
        stack: newStack,
        hasDrawnCard: false,
        nextSuit: null,
        pendingSevens: null,
        playersTurnIndex,
        gameEnded: null,
      };
    }

    case ActionType.END_GAME: {
      return {
        ...state,
        gameEnded: action.payload,
      };
    }

    default:
      throw new Error('invalid state');
  }
}
