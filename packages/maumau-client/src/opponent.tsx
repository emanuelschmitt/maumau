import { Opponent } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: white;
  padding: 8px 16px;
`;

type Props = {
  opponent: Opponent;
};

function OpponentDisplay({ opponent }: Props) {
  return (
    <Wrapper>
      {opponent.name} - {opponent.handCount}
    </Wrapper>
  );
}

export default OpponentDisplay;
