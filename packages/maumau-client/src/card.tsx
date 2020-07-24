import { Action } from 'maumau-server/src/game/reducer';
import { Card as TCard, ActionType, Rank, Player, IncomingMessage, Suit } from 'maumau-server/src/types';
import React from 'react';

import CardFrame from './card-frame';
import { useConnectionContext } from './connection-context';

type Props = {
  card: TCard;
  player: Player;
  children?: React.ReactNode;
};

function isMatch(cardA: TCard, cardB: TCard): boolean {
  return cardA.rank === cardB.rank || cardA.suit === cardB.suit;
}

const rankMap: Record<Rank, string> = {
  [Rank.ACE]: 'A',
  [Rank.KING]: 'K',
  [Rank.QUEEN]: 'Q',
  [Rank.JACK]: 'J',
  [Rank.TEN]: '10',
  [Rank.NINE]: '9',
  [Rank.EIGHT]: '8',
  [Rank.SEVEN]: '7',
};

const suitMap: Record<Suit, string> = {
  [Suit.CLUBS]: 'C',
  [Suit.DIAMONDS]: 'D',
  [Suit.HEARTS]: 'H',
  [Suit.SPADES]: 'S',
};

function canPlayCard(card: TCard, topCard: TCard, possibleActions: ActionType[]): boolean {
  switch (card.rank) {
    case Rank.SEVEN: {
      return possibleActions.includes(ActionType.PLAY_SEVEN);
    }
    case Rank.EIGHT: {
      return possibleActions.includes(ActionType.PLAY_EIGHT);
    }
    case Rank.JACK: {
      return possibleActions.includes(ActionType.PLAY_JACK);
    }
    default: {
      return possibleActions.includes(ActionType.PLAY_REGULAR_CARD) && isMatch(card, topCard);
    }
  }
}

function getAction(card: TCard): Action {
  switch (card.rank) {
    case Rank.SEVEN: {
      return {
        type: ActionType.PLAY_SEVEN,
        payload: card,
      };
    }
    case Rank.EIGHT: {
      return {
        type: ActionType.PLAY_EIGHT,
        payload: card,
      };
    }
    case Rank.JACK: {
      return {
        type: ActionType.PLAY_JACK,
        payload: { card, suit: Suit.CLUBS },
      };
    }
    default: {
      return {
        type: ActionType.PLAY_REGULAR_CARD,
        payload: card,
      };
    }
  }
}

export function getBackgroundUrl(card: TCard) {
  return `/static/${rankMap[card.rank]}${suitMap[card.suit]}.png`;
}

function Card({ card, player, children }: Props) {
  const { state, possibleActions, sendJsonMessage } = useConnectionContext();
  const isEnabled = canPlayCard(card, state.stack[state.stack.length - 1], possibleActions[player.id]);

  const onClick = () => {
    if (!isEnabled) {
      return;
    }
    const message: IncomingMessage = {
      playerId: player.id,
      action: getAction(card),
    };
    sendJsonMessage(message);
  };

  return (
    <CardFrame disabled={!isEnabled} onClick={onClick} backgroundUrl={getBackgroundUrl(card)}>
      {children}
    </CardFrame>
  );
}

export default Card;
