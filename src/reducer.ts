import Player from "./player";
import Card from "./card";
import { Suit } from "./suit";

export type State = {
  players: Player[];
  playersTurnIndex: number;
  stack: Card[];

  // TODO: maybe refactor as enums, special state.
  nextSuit: Suit | null;
  pendingSevens: number | null; // Case when seven is pending and user has to drawn x cards
  hasDrawnCard: boolean; // Case where kannet and has to take card
};

/**
 * Rules
 *
 * Bube
 * - PLAY_JACK kann immer ausgeführt werden
 * - dabei wird das `nextSuite` gesetzt, welches dem nächsten spieler das Suit vorgibt
 * - jedes mal wenn PLAY_REGULAR_CARD oder PLAY_JACK gespielt wird, wird das next suite zurueckgesetzt
 *
 * 8er
 * - next player will miss turn
 * - player index will be double incremented
 *
 * 7er
 * - next player has to chose between PLAY_SEVEN and ACCEPT_PENDING_SEVENS;
 */

export type Action =
  | { type: "PLAY_REGULAR_CARD"; payload: Card }
  | { type: "PLAY_EIGHT"; payload: Card }
  | { type: "PLAY_SEVEN"; payload: Card }
  | { type: "PLAY_JACK"; payload: { card: Card; suit: Suit } }
  | { type: "KANNET_AND_DRAW" }
  | { type: "KANNET" }
  | { type: "ACCEPT_PENDING_SEVENS" };

export function reducer(state: State, action: Action): State {
  const { players, playersTurnIndex, stack } = state;

  switch (action.type) {
    case "PLAY_REGULAR_CARD": {
      const player = players[playersTurnIndex];
      const newHand = player.hand.filter(
        (card) => !card.isEqual(action.payload)
      );
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, action.payload],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        hasDrawnCard: false,
        nextSuit: null,
        pendingSevens: null,
      };
    }

    case "PLAY_EIGHT": {
      const player = players[playersTurnIndex];
      const newHand = player.hand.filter(
        (card) => !card.isEqual(action.payload)
      );
      players[playersTurnIndex].hand = newHand;

      return {
        ...state,
        players,
        stack: [...stack, action.payload],
        playersTurnIndex: (playersTurnIndex + 2) % players.length,
        hasDrawnCard: false,
      };
    }

    case "PLAY_SEVEN": {
      const player = players[playersTurnIndex];
      const newHand = player.hand.filter(
        (card) => !card.isEqual(action.payload)
      );
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, action.payload],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        pendingSevens: (state?.pendingSevens ?? 0) + 1,
        hasDrawnCard: false,
        nextSuit: null,
      };
    }

    case "PLAY_JACK": {
      const player = players[playersTurnIndex];
      const newHand = player.hand.filter(
        (card) => !card.isEqual(action.payload.card)
      );
      players[playersTurnIndex].hand = newHand;

      return {
        players,
        stack: [...stack, action.payload.card],
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        pendingSevens: null,
        hasDrawnCard: false,
        nextSuit: action.payload.suit,
      };
    }

    case "KANNET_AND_DRAW": {
      const firstCard = stack[0]; // stack will never be empty
      if (!firstCard) {
        throw new Error("stack is unexpectidly empty");
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
      };
    }

    case "KANNET": {
      return {
        players,
        hasDrawnCard: false,
        nextSuit: state.nextSuit,
        pendingSevens: null,
        playersTurnIndex: (playersTurnIndex + 1) % players.length,
        stack,
      };
    }

    case "ACCEPT_PENDING_SEVENS": {
      const numberOfCards = state?.pendingSevens ?? 0 * 2;
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
      };
    }

    default:
      throw new Error("invalid state");
  }
}
