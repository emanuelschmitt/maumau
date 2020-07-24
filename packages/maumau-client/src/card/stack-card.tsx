import { ActionType } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import { useConnectionContext } from '../connection-context';

import { cardStyle } from './style';
import { getCardAssetForStackCard } from './utils';

const Frame = styled.div<{ url: string; disabled?: boolean }>(({ url, disabled = false }) => ({
  ...cardStyle,
  background: `url('${url}')`,
  backgroundSize: 'cover',
  opacity: disabled ? '0.3' : '1',
}));

function StackCard() {
  const { sendAction, state, possibleActions } = useConnectionContext();
  const currentPlayer = state.players[state.playersTurnIndex];
  const canDraw = possibleActions[currentPlayer.id].includes(ActionType.KANNET_AND_DRAW);

  const onClick = () =>
    sendAction({
      playerId: currentPlayer.id,
      action: {
        type: state.hasDrawnCard ? ActionType.KANNET : ActionType.KANNET_AND_DRAW,
      },
    });

  return <Frame url={getCardAssetForStackCard()} onClick={onClick} disabled={!canDraw} />;
}

export default StackCard;
