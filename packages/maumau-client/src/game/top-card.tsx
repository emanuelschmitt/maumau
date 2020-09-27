import { Card as TCard, Suit } from 'maumau-server/src/types';
import React from 'react';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';

import Card from './card';
import SuitBadge from './suit-badge';

const Container = styled.div`
  position: relative;
  border-radius: 8px;
  display: inline-flex;
`;

const Badge = styled(animated.div)`
  position: absolute;
  bottom: 5px;
  left: -30px;
  z-index: 1;
`;

export type Props = {
  card: TCard;
  nextSuit?: Suit;
};

function CardStack({ card, nextSuit }: Props) {
  const badges = Boolean(nextSuit) ? [nextSuit] : [];

  const transitions = useTransition(badges, (b) => b as string, {
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' },
  });

  return (
    <Container>
      {transitions.map((transition) => (
        <Badge style={transition.props} key={transition.key}>
          <SuitBadge suit={transition.item} />
        </Badge>
      ))}
      <Card rank={card.rank} suit={card.suit} />
    </Container>
  );
}

export default CardStack;
