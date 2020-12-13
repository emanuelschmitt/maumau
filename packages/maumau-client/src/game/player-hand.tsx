import { Card as TCard, Rank } from 'maumau-server/src/types';
import React from 'react';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';

import PlayableCard from './playable-card';

const MAX_WIDTH = 500;

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 180px;
`;

const CardContainer = styled(animated.div)`
  position: absolute;
`;

const HoverContainer = styled(animated.div)``;

export type Props = {
  hand: TCard[];
  onPlayCard: (card: TCard) => void;
  onSelectJack: (card: TCard) => void;
  canPlayCard: (card: TCard) => boolean;
};

function PlayerHand({ hand, onPlayCard, onSelectJack, canPlayCard }: Props) {
  const transitions = useTransition(hand, (item) => `${item.rank}${item.suit}`, {
    from: (item) => {
      const index = hand.indexOf(item);
      const width = Math.min(MAX_WIDTH / hand.length, 80);
      const x = index * width;
      const center = (hand.length * width) / 2 - 32;

      return {
        transform: `translate3d(${x - center}px, 100px, 0) scale(0)`,
        zIndex: index + 1,
        opacity: 0,
        transformOrigin: 'top center',
      };
    },
    enter: (item) => {
      const index = hand.indexOf(item);
      const width = Math.min(MAX_WIDTH / hand.length, 70);
      const x = index * width;
      const center = (hand.length * width) / 2 - 32;

      return {
        transform: `translate3d(${x - center}px, 0, 0) scale(1)`,
        zIndex: index + 1,
        opacity: 1,
        transformOrigin: 'top center',
      };
    },
    update: (item) => {
      const index = hand.indexOf(item);
      const width = Math.min(MAX_WIDTH / hand.length, 70);
      const x = index * width;
      const center = (hand.length * width) / 2 - 32;

      return {
        transform: `translate3d(${x - center}px, 0, 0) scale(1)`,
        zIndex: index + 1,
        opacity: 1,
        transformOrigin: 'top center',
      };
    },
    leave: {
      transform: `translate3d(0, -100px, 0) scale(0)`,
      zIndex: -1,
      opacity: 0,
      pointerEvents: 'none',
    },
  });

  const onCardPlay = (card: TCard) => () => {
    if (card.rank === Rank.JACK) {
      onSelectJack(card);
    } else {
      onPlayCard(card);
    }
  };

  return (
    <Container>
      {transitions.map(({ item: card, props, key }) => (
        <CardContainer style={props} key={key}>
          <HoverContainer>
            <PlayableCard
              key={card.rank + card.suit}
              card={card}
              buttonProps={{
                onClick: onCardPlay(card),
                disabled: !canPlayCard(card),
              }}
            />
          </HoverContainer>
        </CardContainer>
      ))}
    </Container>
  );
}

export default PlayerHand;
