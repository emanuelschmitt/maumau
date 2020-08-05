import { ActionType } from './action-type';
import { State } from './reducer';

type Rule = (state: State) => boolean;

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

const rules: Record<ActionType, Rule> = {
  PLAY_REGULAR_CARD: ({ players, playersTurnIndex, pendingSevens, stack, nextSuit }) =>
    !pendingSevens &&
    players[playersTurnIndex].hasCard(
      (card) =>
        card.isRegular() && (nextSuit ? card.matchesNextSuit(nextSuit) : card.doesMatch(stack[stack.length - 1])),
    ),
  PLAY_EIGHT: ({ players, playersTurnIndex, pendingSevens, stack, nextSuit }) =>
    !pendingSevens &&
    players[playersTurnIndex].hasCard(
      (card) => card.isEight() && (nextSuit ? card.matchesNextSuit(nextSuit) : card.doesMatch(stack[stack.length - 1])),
    ),
  PLAY_SEVEN: ({ players, playersTurnIndex, stack, nextSuit }) =>
    players[playersTurnIndex].hasCard(
      (card) => card.isSeven() && (nextSuit ? card.matchesNextSuit(nextSuit) : card.doesMatch(stack[stack.length - 1])),
    ),
  PLAY_JACK: ({ players, playersTurnIndex, pendingSevens }) =>
    !pendingSevens && players[playersTurnIndex].hasCard((card) => card.isJack()),
  KANNET_AND_DRAW: ({ pendingSevens, hasDrawnCard }) => !pendingSevens && !hasDrawnCard,
  KANNET: ({ pendingSevens, hasDrawnCard }) => !pendingSevens && hasDrawnCard,
  ACCEPT_PENDING_SEVENS: ({ pendingSevens }) => Boolean(pendingSevens),
};

export function getActionTypesForPlayer(id: number, state: State): ActionType[] {
  const { players, playersTurnIndex } = state;

  if (players[playersTurnIndex].id !== id) {
    return [];
  }

  const allowedActions: ActionType[] = [];
  for (const [action, rule] of Object.entries(rules)) {
    if (rule(state)) {
      allowedActions.push(action as ActionType);
    }
  }

  return allowedActions;
}

export function getPlayerRules(state: State): Record<number, ActionType[]> {
  const rules: Record<number, ActionType[]> = {};
  for (const player of state.players) {
    rules[player.id] = getActionTypesForPlayer(player.id, state);
  }
  return rules;
}

export { rules };
