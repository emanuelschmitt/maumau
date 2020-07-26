import { Player, ActionType } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import ActionButton from './action-button';
import { useConnectionContext } from './connection-context';

const Wrapper = styled.div({
  padding: '16px 32px',
  textAlign: 'center',
});

type Props = {
  player: Player;
};

function Actions({ player }: Props) {
  const { sendAction, possibleActions } = useConnectionContext();
  const canPerformKannet = possibleActions && possibleActions![player.id].includes(ActionType.KANNET);
  const canAcceptPendingSeven =
    possibleActions && possibleActions![player.id].includes(ActionType.ACCEPT_PENDING_SEVENS);
  return (
    <Wrapper>
      <ActionButton
        onClick={() =>
          sendAction({
            playerId: player.id,
            action: {
              type: ActionType.ACCEPT_PENDING_SEVENS,
            },
          })
        }
        disabled={!canAcceptPendingSeven}
      >
        Accept Pending Sevens
      </ActionButton>
      <ActionButton
        onClick={() =>
          sendAction({
            playerId: player.id,
            action: {
              type: ActionType.KANNET,
            },
          })
        }
        disabled={!canPerformKannet}
      >
        Kannet
      </ActionButton>
    </Wrapper>
  );
}

export default Actions;
