import { Card as TCard, ActionType, Rank, Player, Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import useClickSound from '../common/use-click-sound';
import useSuitSelectSound from '../common/use-suit-select-sound';
import { useGameContext } from '../state/game-context';
import ActionButton from '../ui/action-button';
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

  const { state, possibleActions, sendAction } = useGameContext();
  const [playClick] = useClickSound();
  const [playSuitSelect] = useSuitSelectSound();

  const [showDialog, setShowDialog] = React.useState(false);
  const openDialog = () => {
    setShowDialog(true);
    playSuitSelect();
  };
  const hideDialog = () => setShowDialog(false);

  const isEnabled = state && possibleActions && canPlayCard(possibleActions[player.id]);

  const onSelectSuit = (suit: Suit) => {
    sendAction({
      type: ActionType.PLAY_JACK,
      payload: {
        suit,
        card,
      },
    } as any);
    playClick();
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
