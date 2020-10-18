import { ActionType } from "../game/action-type";
import { Action, State } from "../game/reducer";
import Card from "../models/card";
import Player from "../models/player";
import { Rank } from "../models/rank";
import { Suit } from "../models/suit";
import { Session } from "../service/game-session";import random from "../utils/random";
;

type onBotPlayingFn = (sessionId: string, userId: string, action: Action) => void;

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
    public onBotPlaying: onBotPlayingFn

    public playAction(session: Session): void {
        const gameState = session.gameState;
        const state = gameState.getState();
        const player = state.players[state.playersTurnIndex];
        const clientState = gameState.getClientStateForPlayer(player.id);
        const actionTypes = clientState.player.possibleActions;
        const actionType = actionTypes[random(0, actionTypes.length - 1)];
        const action = this.action(player, state, actionType);

        const delay = random(1000, 4000);
        setTimeout(() => {
            if (action != null) {
                this.onBotPlaying(session.id, player.id, action);
            }
        }, delay);
    }

    private action(player: Player, state: State, actionType: ActionType): Action | undefined {
        let action: Action | undefined;
        switch(actionType) {
            case ActionType.PLAY_EIGHT:
            case ActionType.PLAY_REGULAR_CARD:
            case ActionType.PLAY_SEVEN:
            case ActionType.PLAY_JACK:
                action = this.playCardAction(player, state, actionType);
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

    private playCardAction(player: Player, state: State, actionType: ActionType): Action {
        const topCard = state.stack[0];
        var possibleCards = player.hand
            .filter(card => { 
                return rankActionMap[card.rank] == actionType; 
            })
            .filter(card => { 
                if (state.nextSuit != null) { 
                    return card.suit == state.nextSuit || card.isJack 
                } else { 
                    return true; 
                }
            })
            .filter(card => { 
                return card.suit == topCard.suit || card.rank == topCard.rank || card.isJack; 
            })
        const card = possibleCards[random(0, possibleCards.length - 1)];
        return this.actionPayload(actionType, card);
    }

    private actionPayload(actionType: ActionType, card: Card): Action {
        var payload: any = null
        switch (actionType) {
            case ActionType.PLAY_REGULAR_CARD:
            case ActionType.PLAY_SEVEN:
            case ActionType.PLAY_EIGHT:
                payload = { suit: card.suit, rank: card.rank }
                break;
            case ActionType.PLAY_JACK:
                const allSuits = [Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS, Suit.SPADES];
                const nextSuit = allSuits[random(0, allSuits.length - 1)];
                payload = { card: { suit: card.suit, rank: card.rank }, suit: nextSuit }
        }
        return { type: actionType, payload: payload };
    }
}