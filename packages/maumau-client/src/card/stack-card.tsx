import { ActionType } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import Button from '../button';
import { useConnectionContext } from '../connection-context';

import { cardStyle } from './style';
import { getCardAssetForStackCard } from './utils';

const Frame = styled(Button)<{ url: string; disabled?: boolean }>(({ url, disabled = false }) => ({
  ...cardStyle,
  background: `url('${url}')`,
  backgroundSize: 'cover',
  opacity: disabled ? '0.6' : '1',
}));

function StackCard() {
  const { sendAction, state, possibleActions } = useConnectionContext();
  const currentPlayer = state && state.players[state.playersTurnIndex];
  const canDraw =
    possibleActions && currentPlayer && possibleActions[currentPlayer.id].includes(ActionType.KANNET_AND_DRAW);

  const onClick = () => {
    if (!currentPlayer) {
      return;
    }
    sendAction({
      playerId: currentPlayer.id,
      action: {
        type: ActionType.KANNET_AND_DRAW,
      },
    });
  };

  return <Frame url={getCardAssetForStackCard()} onClick={onClick} disabled={!canDraw} />;
}

export default StackCard;
