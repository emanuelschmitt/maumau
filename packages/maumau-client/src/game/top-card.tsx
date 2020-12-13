import { Card as TCard, Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import Card from './card';
import NextSuitBadge from './next-suit-badge';

const Container = styled.div`
  position: relative;
  border-radius: 8px;
  display: inline-flex;
`;

export type Props = {
  card: TCard;
  nextSuit?: Suit;
};

function CardStack({ card, nextSuit }: Props) {
  return (
    <Container>
      <NextSuitBadge nextSuit={nextSuit} />
      <Card rank={card.rank} suit={card.suit} />
    </Container>
  );
}

export default CardStack;
