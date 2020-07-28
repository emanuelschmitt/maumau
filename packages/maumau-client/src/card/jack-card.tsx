import { Card as TCard, ActionType, Rank, Player, Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import ActionButton from '../action-button';
import useClickSound from '../common/use-click-sound';
import { useConnectionContext } from '../connection-context';
import Dialog from '../ui/dialog';

import { Frame } from './playable-card';
import { getCardAssetUrlByCard } from './utils';

const SuitButton = styled(ActionButton)({
  fontSize: '1.5em',
});

type Props = {
  card: TCard;
  player: Player;
  children?: React.ReactNode;
};

function canPlayCard(possibleActions: ActionType[]): boolean {
  return possibleActions.includes(ActionType.PLAY_JACK);
}

function JackCard({ card, player, children }: Props) {
  if (card.rank !== Rank.JACK) {
    throw new Error('invalid render of jack card');
  }

  const { state, possibleActions, sendAction } = useConnectionContext();
  const [playSound] = useClickSound();

  const [showDialog, setShowDialog] = React.useState(false);
  const openDialog = () => setShowDialog(true);
  const hideDialog = () => setShowDialog(false);

  const isEnabled = state && possibleActions && canPlayCard(possibleActions[player.id]);

  const onSelectSuit = (suit: Suit) => {
    sendAction({
      playerId: player.id,
      action: {
        type: ActionType.PLAY_JACK,
        payload: {
          suit,
          card,
        },
      },
    });
    playSound();
    hideDialog();
  };

  return (
    <>
      <Frame disabled={!isEnabled} onClick={openDialog} url={getCardAssetUrlByCard(card)}>
        {children}
      </Frame>
      {showDialog && (
        <Dialog footer={<ActionButton onClick={hideDialog}>Cancel</ActionButton>}>
          <h3>Select Suit</h3>
          <SuitButton onClick={() => onSelectSuit(Suit.SPADES)}>♠️</SuitButton>
          <SuitButton onClick={() => onSelectSuit(Suit.CLUBS)}>♣️</SuitButton>
          <SuitButton onClick={() => onSelectSuit(Suit.HEARTS)}>♥️</SuitButton>
          <SuitButton onClick={() => onSelectSuit(Suit.DIAMONDS)}>♦️</SuitButton>
        </Dialog>
      )}
    </>
  );
}

export default React.memo(JackCard);
