import { Action } from 'maumau-server/src/game/reducer';
import { Card as TCard, ActionType, Rank, Player, Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import { useConnectionContext } from '../connection-context';

import { cardStyle } from './style';
import { getCardAssetUrlByCard } from './utils';

type Props = {
  card: TCard;
  player: Player;
  children?: React.ReactNode;
};

function isMatch(cardA: TCard, cardB: TCard): boolean {
  return cardA.rank === cardB.rank || cardA.suit === cardB.suit;
}

function matchesSuit(card: TCard, suit: Suit): boolean {
  return card.suit === suit;
}

function canPlayCard(card: TCard, topCard: TCard, possibleActions: ActionType[]): boolean {
  switch (card.rank) {
    case Rank.SEVEN: {
      return possibleActions.includes(ActionType.PLAY_SEVEN) && isMatch(card, topCard);
    }
    case Rank.EIGHT: {
      return possibleActions.includes(ActionType.PLAY_EIGHT) && isMatch(card, topCard);
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

const Frame = styled.div<{ url: string; disabled?: boolean }>(({ url, disabled = false }) => ({
  ...cardStyle,
  background: `url('${url}')`,
  opacity: disabled ? '0.3' : '1',
  cursor: disabled ? 'unset' : 'pointer',
  backgroundSize: 'cover',
}));

function Card({ card, player, children }: Props) {
  const { state, possibleActions, sendAction } = useConnectionContext();

  const isEnabled =
    state &&
    possibleActions &&
    (state.nextSuit
      ? matchesSuit(card, state.nextSuit)
      : canPlayCard(card, state.stack[state.stack.length - 1], possibleActions[player.id]));

  const onClick = () => {
    if (!isEnabled) {
      return;
    }
    sendAction({
      playerId: player.id,
      action: getAction(card),
    });
  };

  return (
    <Frame disabled={!isEnabled} onClick={onClick} url={getCardAssetUrlByCard(card)}>
      {children}
    </Frame>
  );
}

export default Card;
