import { ActionType } from '../game/action-type';
import { State } from '../game/reducer';
import { Card } from '../types';
import random from '../utils/random-between';

import { Bot } from './bots';

export default class EasyBot implements Bot {
  public chooseActionType(actionTypes: ActionType[]): ActionType {
    const nonKannetAction = actionTypes.filter((type) => {
      return type !== ActionType.KANNET_AND_DRAW && type !== ActionType.KANNET;
    });
    let filteredActionTypes: ActionType[];
    if (nonKannetAction.length > 0) {
      filteredActionTypes = nonKannetAction;
    } else {
      filteredActionTypes = actionTypes;
    }
    const max = filteredActionTypes.length - 1;
    const index = random(0, max);
    return filteredActionTypes[index];
  }

  public chooseCard(cards: Card[], state: State, actionType: ActionType): Card {
    const max = cards.length - 1;
    const index = random(0, max);
    return cards[index];
  }
}
