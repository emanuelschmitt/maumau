import createBot, { Bot } from '../bot/bots';
import { ActionType } from '../game/action-type';
import GameState from '../game/game-state';
import { Action, State } from '../game/reducer';
import { getActionTypesForPlayer } from '../game/rules';
import { BotDifficulty } from '../models/bot-difficulty';
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

  public playAction(gameState: GameState, difficulty: BotDifficulty): void {
    const state = gameState.getState();
    if (Boolean(state.gameEnded)) {
      return;
    }

    const player = state.players[state.playersTurnIndex];
    const possibleActionTypes = getActionTypesForPlayer(player.id, state);

    const bot = createBot(difficulty);
    const actionType = bot.chooseActionType(possibleActionTypes, state);
    const action = this.createAction(player, state, actionType, bot);

    const delay = random(1000, 1500);
    setTimeout(() => {
      if (action) {
        this.onBotPlaying(player.id, action);
      }
    }, delay);
  }

  private createAction(player: Player, state: State, actionType: ActionType, bot: Bot): Action | undefined {
    let action: Action | undefined;
    switch (actionType) {
      case ActionType.PLAY_EIGHT:
      case ActionType.PLAY_REGULAR_CARD:
      case ActionType.PLAY_SEVEN:
      case ActionType.PLAY_JACK:
        action = this.getRegularCardAction(player, state, actionType, bot);
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
    }
    return action;
  }

  private getRegularCardAction(player: Player, state: State, actionType: ActionType, bot: Bot): Action {
    const topCard = state.stack[0];
    const possibleCards = player.hand
      .filter((card) => {
        return rankActionMap[card.rank] === actionType;
      })
      .filter((card) => {
        // Does next suit exist, then match or is joker
        if (state.nextSuit !== null) {
          return card.suit === state.nextSuit || card.isJack();
        } else {
          return true;
        }
      })
      .filter((card) => {
        return card.suit === topCard.suit || card.rank === topCard.rank || card.isJack;
      });

    const card = bot.chooseCard(possibleCards, state, actionType);
    return this.getRegularActionWithPayload(actionType, card);
  }

  private getRegularActionWithPayload(actionType: ActionType, card: Card): Action {
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
