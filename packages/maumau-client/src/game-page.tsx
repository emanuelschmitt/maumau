import { Card, Rank, Suit, ActionType, Action } from 'maumau-server/src/types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { useGameContext } from './context/game-context';
import { useSessionContext } from './context/session-context';
import GameEnded from './game-ended';
import GameBoard from './game/game-board';
import { isCardJack, isCardMatch } from './game/utils/card-utils';

function getAction(card: Card): Action {
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

function GamePage() {
  const [session] = useSessionContext();
  const game = useGameContext();
  const [jackCard, setJackCard] = React.useState<Card | null>(null);

  if (!session.sessionId) {
    return <Redirect to="/" />;
  }

  if (!game?.state) {
    return null;
  }

  const { state, sendAction } = game;
  const { player, gameEnded, topCard, opponents, pendingSevens, nextSuit } = state;

  if (gameEnded) {
    return <GameEnded {...{ player, gameEnded, opponents }} />;
  }

  const onPlayCard = (card: Card) => sendAction(getAction(card));
  const onSelectJack = (card: Card) => setJackCard(card);
  const onCancelJack = () => setJackCard(null);
  const onPlayJack = (card: Card, suit: Suit) => {
    if (!jackCard) {
      return;
    }
    sendAction({
      type: ActionType.PLAY_JACK,
      payload: {
        card,
        suit,
      },
    });
    setJackCard(null);
  };

  const canDo = (action: ActionType) => player.possibleActions.includes(action);
  const onDrawCard = () => sendAction({ type: ActionType.KANNET_AND_DRAW });
  const onKannet = () => sendAction({ type: ActionType.KANNET });
  const onAcceptPendingSeven = () => sendAction({ type: ActionType.ACCEPT_PENDING_SEVENS });
  const canPlayCard = (card: Card): boolean => {
    const neededPossibleAction = rankActionMap[card.rank];
    const isActionPossible = player.possibleActions.includes(neededPossibleAction);
    const canPlayCard = nextSuit ? nextSuit === card.suit : isCardMatch(card, topCard);
    return isActionPossible && (canPlayCard || isCardJack(card));
  };

  return (
    <GameBoard
      opponents={opponents}
      topCard={topCard}
      player={player}
      pendingSeven={pendingSevens}
      playingJack={jackCard}
      nextSuit={nextSuit ? nextSuit : undefined}
      onPlayCard={onPlayCard}
      onSelectJack={onSelectJack}
      onPlayJack={onPlayJack}
      canDo={canDo}
      canPlayCard={canPlayCard}
      onDrawCard={onDrawCard}
      onKannet={onKannet}
      onAcceptPendingSeven={onAcceptPendingSeven}
      onCancelJack={onCancelJack}
    />
  );
}

export default GamePage;
