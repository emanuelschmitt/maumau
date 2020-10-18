import { ActionType } from "../game/action-type";
import { State } from "../game/reducer";
import { Card } from "../types";
import random from "../utils/random";

export default class DumbBot {

    public chooseActionType(actionTypes: ActionType[]): ActionType {
        const max = actionTypes.length - 1;
        const index = random(0, max);
        return actionTypes[index];
    }

    public chooseCard(cards: Card[], state: State, actionType: ActionType): Card {
        const max = cards.length - 1;
        const index = random(0, max);
        return cards[index];
    }
}
