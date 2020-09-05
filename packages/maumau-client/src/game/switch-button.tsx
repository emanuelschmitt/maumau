import { darken } from 'polished';
import React from 'react';
import styled from 'styled-components';

import SwitchIcon from '../icons/switch';
import PlainButton from '../ui/plain-button';

const Button = styled(PlainButton)`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 60px;
  font-size: 1.5em;
  background: #eeeeee;
  transition: background 0.25s ease;

  &:hover {
    cursor: pointer;
    background: ${darken(0.1, '#eeeeee')};
  }
`;

type SwitchButtonProps = React.HTMLProps<HTMLButtonElement>;

function SwitchButton(props: SwitchButtonProps) {
  return (
    <Button {...(props as any)}>
      <SwitchIcon />
    </Button>
  );
}

export default SwitchButton;
