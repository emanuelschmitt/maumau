import { Player, ActionType } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import useClickSound from './common/use-click-sound';
import { useGameContext } from './state/game-context';
import ActionButton from './ui/action-button';

const Wrapper = styled.div({
  padding: '16px 32px',
  textAlign: 'center',
});

type Props = {
  player: Player;
};

function Actions({ player }: Props) {
  const [playSound] = useClickSound();
  const { possibleActions, sendAction } = useGameContext();
  const canPerformKannet = possibleActions && possibleActions![player.id].includes(ActionType.KANNET);
  const canAcceptPendingSeven =
    possibleActions && possibleActions![player.id].includes(ActionType.ACCEPT_PENDING_SEVENS);

  return (
    <Wrapper>
      <ActionButton
        onClick={() => {
          sendAction({
            type: ActionType.ACCEPT_PENDING_SEVENS,
          } as any);
          playSound();
        }}
        disabled={!canAcceptPendingSeven}
      >
        Accept Pending Sevens
      </ActionButton>
      <ActionButton
        onClick={() => {
          sendAction({
            type: ActionType.KANNET,
          } as any);
          playSound();
        }}
        disabled={!canPerformKannet}
      >
        Kannet
      </ActionButton>
    </Wrapper>
  );
}

export default Actions;
