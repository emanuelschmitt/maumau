import { Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import SuitIcon from './suit-icon';

const Container = styled.div`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  font-size: 1.1em;
  background: white;
  transition: background 0.25s ease;
  margin: 8px;
  box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.15);
`;

export type Props = { suit: Suit };

function SuitButton({ suit }: Props) {
  return (
    <Container>
      <SuitIcon suit={suit} />
    </Container>
  );
}

export default SuitButton;
