import { Action, State } from "./reducer";

type ActionType = Action["type"];
type Rule = (state: State) => boolean;

const rules: Record<ActionType, Rule> = {
  PLAY_REGULAR_CARD: ({
    players,
    playersTurnIndex,
    pendingSevens,
    stack,
    nextSuit,
  }) =>
    !pendingSevens &&
    players[playersTurnIndex].hasCard(
      (card) =>
        card.isRegular() &&
        card.doesMatch(stack[0]) &&
        card.matchesNextSuit(nextSuit)
    ),
  PLAY_EIGHT: ({ players, playersTurnIndex, pendingSevens, stack, nextSuit }) =>
    !pendingSevens &&
    players[playersTurnIndex].hasCard(
      (card) =>
        card.isEight() &&
        card.doesMatch(stack[0]) &&
        card.matchesNextSuit(nextSuit)
    ),
  PLAY_SEVEN: ({ players, playersTurnIndex, pendingSevens, stack, nextSuit }) =>
    !pendingSevens &&
    players[playersTurnIndex].hasCard(
      (card) =>
        card.isSeven() &&
        card.doesMatch(stack[0]) &&
        card.matchesNextSuit(nextSuit)
    ),
  PLAY_JACK: ({ players, playersTurnIndex, pendingSevens }) =>
    !pendingSevens &&
    players[playersTurnIndex].hasCard((card) => card.isJack()),
  KANNET_AND_DRAW: ({ pendingSevens, hasDrawnCard }) =>
    !pendingSevens && !hasDrawnCard,
  KANNET: ({ pendingSevens, hasDrawnCard }) => !pendingSevens && hasDrawnCard,
  ACCEPT_PENDING_SEVENS: ({ pendingSevens }) => Boolean(pendingSevens),
};

export function getActionTypesForPlayer(
  id: number,
  state: State
): ActionType[] {
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
  let rules: Record<number, ActionType[]> = {};
  for (const player of state.players) {
    rules[player.id] = getActionTypesForPlayer(player.id, state);
  }
  return rules;
}

export { rules };
