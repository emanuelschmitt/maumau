import { ActionType } from '../game/action-type';
import { State } from '../game/reducer';
import { BotDifficulty } from './bot-difficulty';
import { Card } from '../types';

import DumbBot from './dumb-bot';
import EasyBot from './easy-bot';
import HardBot from './hard-bot';

export interface Bot {
  chooseActionType: (actionTypes: ActionType[], state: State) => ActionType;
  chooseCard: (cards: Card[], state: State, actionType: ActionType) => Card;
}

export default function createBot(difficulty: BotDifficulty): Bot {
  switch (difficulty) {
    case BotDifficulty.DUMB:
      return new DumbBot();
    case BotDifficulty.EASY:
      return new EasyBot();
    case BotDifficulty.HARD:
      return new HardBot();
  }
}
