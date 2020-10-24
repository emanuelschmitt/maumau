import { BotDifficulty } from '../bot/bot-difficulty';
import createBot, { Bot } from '../bot/bots';
import { ActionType } from '../game/action-type';
import { Action, State } from '../game/reducer';
import { getActionTypesForPlayer } from '../game/rules';
import Card from '../models/card';
import Player from '../models/player';
import { Rank } from '../models/rank';
import { Suit } from '../models/suit';
import random from '../utils/random';

const rankActionMap: Record<Rank, ActionType> = {
  [Rank.EIGHT]: ActionType.PLAY_EIGHT,
  [Rank.JACK]: ActionType.PLAY_JACK,
  [Rank.SEVEN]: ActionType.PLAY_SEVEN,
  [Rank.ACE]: ActionType.PLAY_REGULAR_CARD,
  [Rank.KING]: ActionType.PLAY_REGULAR_CARD,
  [Rank.NINE]: ActionType.PLAY_REGULAR_CARD,
  [Rank.QUEEN]: ActionType.PLAY_REGULAR_CARD,
  [Rank.TEN]: ActionType.PLAY_REGULAR_CARD,
};

type OnBotPlayingFn = (userId: string, action: Action) => void;

export default class BotController {
  private onBotPlaying: OnBotPlayingFn;

  constructor(options: { onBotPlaying: OnBotPlayingFn }) {
    this.onBotPlaying = options.onBotPlaying;
  }

  public playAction(state: State, difficulty: BotDifficulty): void {
    // 1. Ensure that only the player is playing who is a bot
    // 2. Ensure game is not ended
    if (Boolean(state.gameEnded)) {
      return;
    }

    // Pick an actionType to play of possible actions and build the action;
    const player = state.players[state.playersTurnIndex];
    const possibleActionTypes = getActionTypesForPlayer(player.id, state);
    const bot = createBot(difficulty);

    // Idea: Create a record of possible cards with prepared actions appended to it.
    // Also interesting for the client state since this logic is very complicated on the
    // frontend already.
    // Bot then only has to chose a possible card and off we go.
    const actionType = bot.chooseActionType(possibleActionTypes, state);
    const action = this.createAction(player, state, actionType, bot);

    // No delay because of concurrency issues.
    // FIXME: Fix concurrency.
    this.onBotPlaying(player.id, action);
  }

  private createAction(player: Player, state: State, actionType: ActionType, bot: Bot): Action {
    let action: Action | undefined;
    switch (actionType) {
      case ActionType.PLAY_EIGHT:
      case ActionType.PLAY_REGULAR_CARD:
      case ActionType.PLAY_SEVEN:
      case ActionType.PLAY_JACK:
        action = this.getCardAction(player, state, actionType, bot);
        break;
      case ActionType.KANNET:
        action = { type: ActionType.KANNET };
        break;
      case ActionType.KANNET_AND_DRAW:
        action = { type: ActionType.KANNET_AND_DRAW };
        break;
      case ActionType.ACCEPT_PENDING_SEVENS:
        action = { type: ActionType.ACCEPT_PENDING_SEVENS };
        break;
      default:
        throw new Error('Bot: could not find action for player');
    }
    return action;
  }

  private getCardAction(player: Player, state: State, actionType: ActionType, bot: Bot): Action {
    const topCard = state.stack[state.stack.length - 1];
    const possibleCards = player.hand
      .filter((card) => {
        return rankActionMap[card.rank] === actionType;
      })
      .filter((card) => card.matchesNextSuit(state.nextSuit) || card.doesMatch(topCard) || card.isJack());

    const card = bot.chooseCard(possibleCards, state, actionType);
    return this.getCardActionWithPayload(actionType, card);
  }

  private getCardActionWithPayload(actionType: ActionType, card: Card): Action {
    let payload: any = null;
    switch (actionType) {
      case ActionType.PLAY_REGULAR_CARD:
      case ActionType.PLAY_SEVEN:
      case ActionType.PLAY_EIGHT:
        payload = { suit: card.suit, rank: card.rank };
        break;
      case ActionType.PLAY_JACK:
        const allSuits = [Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS, Suit.SPADES];
        const nextSuit = allSuits[random(0, allSuits.length - 1)];
        payload = { card: { suit: card.suit, rank: card.rank }, suit: nextSuit };
        break;
    }
    return { type: actionType, payload: payload };
  }
}
