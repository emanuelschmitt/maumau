import Card from '../models/card';
import Player from '../models/player';
import { Suit } from '../models/suit';
import { logger } from '../server/logger';

import { ActionType } from './action-type';

export type State = {
  players: Player[];
  playersTurnIndex: number;
  stack: Card[];
  nextSuit: Suit | null;
  pendingSevens: number | null; // Case when seven is pending and user has to drawn x cards
  hasDrawnCard: boolean; // Case where kannet and has to take card
  gameEnded: boolean;
};

export type Action =
  | { type: ActionType.PLAY_REGULAR_CARD; payload: Card }
  | { type: ActionType.PLAY_EIGHT; payload: Card }
  | { type: ActionType.PLAY_SEVEN; payload: Card }
  | { type: ActionType.PLAY_JACK; payload: { card: Card; suit: Suit } }
  | { type: ActionType.KANNET_AND_DRAW }
  | { type: ActionType.KANNET }
  | { type: ActionType.ACCEPT_PENDING_SEVENS };

export function reducer(state: State, action: Action): State {
  const { players, playersTurnIndex, stack } = state;

  logger.debug(`Reducer: Emiting action ${action.type}`);

  switch (action.type) {
    case ActionType.PLAY_REGULAR_CARD: {
      const player = players[playersTurnIndex];
      const newHand = player.hand.filter((card) => !card.isEqual(action.payload));
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, action.payload],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        hasDrawnCard: false,
        nextSuit: null,
        pendingSevens: null,
        gameEnded: newHand.length === 0,
      };
    }

    case ActionType.PLAY_EIGHT: {
      const player = players[playersTurnIndex];
      const newHand = player.hand.filter((card) => !card.isEqual(action.payload));
      players[playersTurnIndex].hand = newHand;

      const nextPlayerIndex = (playersTurnIndex + 2) % players.length;
      const nextPlayer = players[nextPlayerIndex];

      return {
        ...state,
        players,
        stack: [...stack, action.payload],
        playersTurnIndex: (playersTurnIndex + 2) % players.length,
        hasDrawnCard: false,
        nextSuit: null,
        gameEnded: newHand.length === 0 && nextPlayer.id !== player.id,
      };
    }

    case ActionType.PLAY_SEVEN: {
      const player = players[playersTurnIndex];
      const newHand = player.hand.filter((card) => !card.isEqual(action.payload));
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, action.payload],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        pendingSevens: (state?.pendingSevens ?? 0) + 1,
        hasDrawnCard: false,
        nextSuit: null,
        gameEnded: newHand.length === 0,
      };
    }

    case ActionType.PLAY_JACK: {
      const player = players[playersTurnIndex];
      const newHand = player.hand.filter((card) => !card.isEqual(action.payload.card));
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, action.payload.card],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        pendingSevens: null,
        hasDrawnCard: false,
        nextSuit: action.payload.suit,
        gameEnded: newHand.length === 0,
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
        gameEnded: false,
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
        gameEnded: false,
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
        gameEnded: false,
      };
    }

    default:
      throw new Error('invalid state');
  }
}
