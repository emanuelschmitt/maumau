import { Suit } from 'maumau-server/src/types';
import React from 'react';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';

import SuitBadge from './suit-badge';

const Badge = styled(animated.div)`
  position: absolute;
  bottom: 5px;
  left: -30px;
  z-index: 1;
`;

export type Props = {
  nextSuit?: Suit;
};

function NextSuitBadge({ nextSuit }: Props) {
  const hasBadge = Boolean(nextSuit);

  const transitions = useTransition(hasBadge, null, {
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' },
  });

  return (
    <>
      {transitions.map(
        (transition) =>
          transition.item && (
            <Badge style={transition.props} key={transition.key}>
              {nextSuit && <SuitBadge suit={nextSuit} />}
            </Badge>
          ),
      )}
    </>
  );
}

export default NextSuitBadge;
