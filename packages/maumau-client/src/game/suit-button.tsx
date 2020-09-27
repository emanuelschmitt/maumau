import { Suit } from 'maumau-server/src/types';
import { darken } from 'polished';
import React from 'react';
import styled from 'styled-components';

import PlainButton from '../ui/plain-button';

import SwitchIcon from './suit-icon';

const Button = styled(PlainButton)`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 60px;
  font-size: 1.2em;
  background: white;
  transition: background 0.25s ease;
  margin: 8px;
  box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.15);

  &:hover {
    cursor: pointer;
    background: ${darken(0.05, '#fff')};
  }
`;

type SwitchButtonProps = { suit: Suit } & React.HTMLProps<HTMLButtonElement>;

function SuitButton({ suit, ...props }: SwitchButtonProps) {
  return (
    <Button {...(props as any)}>
      <SwitchIcon suit={suit} />
    </Button>
  );
}

export default SuitButton;
