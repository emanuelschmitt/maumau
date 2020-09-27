import React from 'react';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';

const Container = styled(animated.div)`
  display: inline-block;
  padding: 16px 32px;
  background: red;
  color: white;
  border-radius: 16px;
  font-size: 1.15em;
  margin: 8px;
`;

export type Props = {
  show?: boolean;
};

function TurnIndicator({ show }: Props) {
  const transitions = useTransition(show, null, {
    from: {
      transform: 'scale(0)',
    },
    enter: {
      transform: 'scale(1)',
    },
    leave: {
      transform: 'scale(0)',
    },
  });
  return (
    <>
      {transitions.map(
        ({ key, props: style, item }) =>
          item && (
            <Container key={key} style={style}>
              Your Turn
            </Container>
          ),
      )}
    </>
  );
}

export default TurnIndicator;
