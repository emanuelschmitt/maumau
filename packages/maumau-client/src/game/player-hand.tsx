import { Card as TCard } from 'maumau-server/src/types';
import React from 'react';
import { useTransition, config, animated } from 'react-spring';
import styled from 'styled-components';

import Card from './card';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  hand: TCard[];
};

function PlayerHand({ hand }: Props) {
  const transitions = useTransition(hand, (item) => `${item.rank}${item.suit}`, {
    from: { transform: 'scale(0)' },
    enter: { transform: 'scale(1)' },
    leave: { transform: 'scale(0)' },
    config: config.stiff,
  });

  return (
    <Container>
      {transitions.map(({ item: card, props, key }) => (
        <animated.div style={props} key={key}>
          <Card key={card.rank + card.suit} rank={card.rank} suit={card.suit} />
        </animated.div>
      ))}
    </Container>
  );
}

export default PlayerHand;
