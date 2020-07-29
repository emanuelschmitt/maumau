import { Action } from 'maumau-server/src/game/reducer';
import { Card as TCard, ActionType, Rank, Player, Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import useClickSound from '../common/use-click-sound';
import { useConnectionContext } from '../connection-context';
import BaseButton from '../ui/base-button';

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
    default: {
      return {
        type: ActionType.PLAY_REGULAR_CARD,
        payload: card,
      };
    }
  }
}

export const Frame = styled(BaseButton)<{ url: string; disabled?: boolean }>(({ url, disabled = false }) => ({
  ...cardStyle,
  background: `url('${url}')`,
  opacity: disabled ? '0.6' : '1',
  cursor: disabled ? 'unset' : 'pointer',
  backgroundSize: 'cover',
}));

function Card({ card, player, children }: Props) {
  const { state, possibleActions, sendAction } = useConnectionContext();
  const [playSound] = useClickSound();

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
    playSound();
  };

  return (
    <Frame disabled={!isEnabled} onClick={onClick} url={getCardAssetUrlByCard(card)}>
      {children}
    </Frame>
  );
}

export default React.memo(Card);
