import { ActionType } from "../game/action-type";
import { Action, State } from "../game/reducer";
import Card from "../models/card";
import Player from "../models/player";
import { Rank } from "../models/rank";
import { Suit } from "../models/suit";
import { Session } from "../service/game-session";;

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
        const count = actionTypes.length;
        if (count == 0) {
            throw "No actions to player for bot '" + player.name + "'.";
        }
        const random = Math.round(Math.random() * (count - 1));
        const actionType = actionTypes[random];
        console.log("action: " + actionType);
        console.log("random: " + random);
        console.log("topcard rank: " + state.stack[0].rank);

        var action: Action | undefined
        switch(actionType) {
            case ActionType.PLAY_EIGHT, ActionType.PLAY_JACK, ActionType.PLAY_REGULAR_CARD, ActionType.PLAY_SEVEN:
                action = this.playCard(player, state, actionType);
                break;
            case ActionType.KANNET:
                action = { type: ActionType.KANNET }
                break;
            case ActionType.KANNET_AND_DRAW:
                action = { type: ActionType.KANNET_AND_DRAW }
                break;
            case ActionType.ACCEPT_PENDING_SEVENS:
                action = { type: ActionType.ACCEPT_PENDING_SEVENS }
                break;
        }

        // TODO: Make it delayed async.
        if (action != null) {
            console.log("action set");
            this.onBotPlaying(session.id, player.id, action);
        } else {
            console.log("no action ... ");
        }
    }

    private playCard(player: Player, state: State, actionType: ActionType) {
        console.log("player: " + player);
        console.log("0: " + player.hand.map(card => card.rank + "." + card.suit));
        var possibleCards = player.hand
            .filter(card => { rankActionMap[card.rank] == actionType })
        console.log("1: " + possibleCards)
        possibleCards = possibleCards 
            .filter(card => { if (state.nextSuit != null) { return card.suit == state.nextSuit || card.isJack } else { return true; }})
        console.log("2: " + possibleCards)
        possibleCards = possibleCards
            .filter(card => { (card.suit == state.stack[0].suit || card.rank == state.stack[0].rank) || card.isJack })
        console.log("3: " + possibleCards)

        console.log("step1: ");
        const card = this.randomCard(possibleCards)
        console.log("step2: " + card.suit + "," + card.rank);
        return this.generateAction(actionType, card);
    }

    private generateAction(actionType: ActionType, card: Card): Action {
        var payload: any = null
        switch (actionType) {
            case ActionType.PLAY_REGULAR_CARD, ActionType.PLAY_SEVEN, ActionType.PLAY_EIGHT:
                payload = { suit: card.suit, rank: card.rank }
                break;
            case ActionType.PLAY_JACK:
                const allSuits = [Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS, Suit.SPADES];
                const random = Math.floor(Math.random() * (allSuits.length - 1));
                const nextSuit = allSuits[random];
                payload = { card: { suit: card.suit, rank: card.rank }, suit: nextSuit }
        }
        return { type: actionType, payload: payload };
    }

    private randomCard(cards: Card[]): Card {
        const count = cards.length;
        if (count == 0) {
            throw "No cards to choose from.";
        }
        const random = Math.round(Math.random() * (count - 1));
        console.log(cards);
        console.log(random);
        const card = cards[random];
        return card;
    }
}