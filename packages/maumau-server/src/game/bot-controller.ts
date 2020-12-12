import { BotDifficulty } from '../bot/bot-difficulty';
import createBot, { Bot } from '../bot/bots';
import Card from '../models/card';
import Player from '../models/player';
import { Rank } from '../models/rank';
import { Suit } from '../models/suit';
import delay from '../utils/delay';
import randomBetween from '../utils/random-between';

import { ActionType } from './action-type';
import { Dispatch } from './game-state';
import { Action, State } from './reducer';
import { getActionTypesForPlayer } from './rules';

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

export default class BotController {
  private getState: () => State;
  private dispatch: Dispatch;
  private interval: number;
  private isPlaying: boolean;

  constructor(getState: () => State, dispatch: Dispatch) {
    this.getState = getState;
    this.dispatch = dispatch;
    this.isPlaying = false;
  }

  public start() {
    this.interval = setInterval(this.playBotIfNeeded.bind(this), 1000);
  }

  public stop() {
    clearInterval(this.interval);
  }

  private async playBotIfNeeded() {
    const state = this.getState();

    if (state.gameEnded) {
      // don't play bot if game has ended.
      return;
    }

    const player = state.players[state.playersTurnIndex];

    if (player.isBot() && player.bot && !this.isPlaying) {
      try {
        this.isPlaying = true;
        await this.playAction(state, player.bot);
      } finally {
        this.isPlaying = false;
      }
    }
  }

  public async playAction(state: State, difficulty: BotDifficulty): Promise<void> {
    // 1. Ensure that only the player is playing who is a bot
    // 2. Ensure game is not ended
    if (Boolean(state.gameEnded)) {
      return;
    }

    // Pick an actionType to play of possible actions and build the action;
    const player = state.players[state.playersTurnIndex];
    const possibleActionTypes = getActionTypesForPlayer(player.id, state);
    const bot = createBot(difficulty);

    // Bot then only has to chose a possible card and off we go.
    const actionType = bot.chooseActionType(possibleActionTypes, state);
    const action = this.createAction(player, state, actionType, bot);

    // delay the bot;
    const randomDelayMs = randomBetween(1000, 3000);
    await delay(randomDelayMs);

    this.dispatch(action);
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
        const nextSuit = allSuits[randomBetween(0, allSuits.length - 1)];
        payload = { card: { suit: card.suit, rank: card.rank }, suit: nextSuit };
        break;
    }
    return { type: actionType, payload: payload };
  }
}
