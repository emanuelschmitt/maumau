import { ActionType } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import useClickSound from '../common/use-click-sound';
import { useGameContext } from '../state/game-context';
import BaseButton from '../ui/base-button';

import { cardStyle } from './style';
import { getCardAssetForStackCard } from './utils';

const Frame = styled(BaseButton)<{ url: string; disabled?: boolean }>(({ url, disabled = false }) => ({
  ...cardStyle,
  background: `url('${url}')`,
  backgroundSize: 'cover',
  opacity: disabled ? '0.6' : '1',
}));

function StackCard() {
  const [playSound] = useClickSound();
  const { sendAction, state, possibleActions } = useGameContext();
  const currentPlayer = state && state.players[state.playersTurnIndex];
  const canDraw =
    possibleActions && currentPlayer && possibleActions[currentPlayer.id].includes(ActionType.KANNET_AND_DRAW);

  const onClick = () => {
    if (!currentPlayer) {
      return;
    }
    sendAction({
      type: ActionType.KANNET_AND_DRAW,
    } as any);
    playSound();
  };

  return <Frame url={getCardAssetForStackCard()} onClick={onClick} disabled={!canDraw} />;
}

export default StackCard;
