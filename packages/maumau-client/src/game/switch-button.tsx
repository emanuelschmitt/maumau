import { darken } from 'polished';
import React from 'react';
import { useTransition, animated } from 'react-spring';
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
  background: white;
  transition: background 0.25s ease;
  box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.15);
  margin: 16px;

  &:hover {
    cursor: pointer;
    background: ${darken(0.05, '#ffffff')};
  }
`;

const Container = styled(animated.div)`
  display: inline-flex;
  transform-origin: center center;
`;

type SwitchButtonProps = { show: boolean } & React.HTMLProps<HTMLButtonElement>;

function SwitchButton(props: SwitchButtonProps) {
  const transitions = useTransition(props.show, null, {
    from: {
      transform: 'scale(0) rotate(0deg)',
    },
    enter: {
      transform: 'scale(1) rotate(360deg)',
    },
    leave: {
      transform: 'scale(0) rotate(0deg)',
    },
  });
  return (
    <>
      {transitions.map(
        ({ key, props: style, item }) =>
          item && (
            <Container style={style} key={key}>
              <Button {...(props as any)}>
                <SwitchIcon />
              </Button>
            </Container>
          ),
      )}
    </>
  );
}

export default SwitchButton;
