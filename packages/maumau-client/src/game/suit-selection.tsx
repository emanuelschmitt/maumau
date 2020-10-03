import { Suit } from 'maumau-server/src/types';
import React from 'react';
import { useSprings, animated, interpolate, config } from 'react-spring';
import styled from 'styled-components';

import HideShowTransition from './hide-show-transition';
import SuitButton from './suit-button';
import { swap } from './utils/swap';

const Container = styled.div`
  position: relative;
  height: 100px;
  width: 200px;
`;

const allSuit: Suit[] = [Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS, Suit.SPADES];

const setter = ({ order, expanded = false }: { order: number[]; expanded?: boolean }) => (index: number) => ({
  x: expanded ? order.indexOf(index) * 50 : order.indexOf(index) + 3 * 50,
  scale: 1,
  zIndex: order.indexOf(index) + 1,
  immediate: (n: any) => n === 'zIndex',
  config: config.stiff,
});

type SuitSelectionProps = {
  onSelection?: (suit: Suit) => void;
  show?: boolean;
  disabled?: boolean;
};

function SuitSelection({ onSelection, show = true, disabled = false }: SuitSelectionProps) {
  const expanded = React.useRef(false);
  const order = React.useRef(allSuit.map((_, index) => index));

  const [springs, setSprings] = useSprings(
    allSuit.length,
    setter({ order: order.current, expanded: expanded.current }),
  );

  const onClick = (index: number) => () => {
    if (disabled) {
      return true;
    }
    const newOrder = swap(order.current, order.current.indexOf(index), 3);
    order.current = newOrder;
    expanded.current = !expanded.current;
    setSprings(setter({ order: order.current, expanded: expanded.current }) as any);
    onSelection && onSelection(allSuit[order.current[3]]);
  };

  React.useEffect(() => {
    setSprings(setter({ order: order.current, expanded: true && !disabled }) as any);
    expanded.current = true && !disabled;
  }, [setSprings, disabled]);

  return (
    <HideShowTransition show={show}>
      <Container>
        {springs.map(({ zIndex, x, scale }, i) => (
          <animated.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              zIndex,
              transform: interpolate([x, scale], (x, s) => `translate3d(${x}px, -50%, 0) scale(${s})`),
            }}
            onClick={onClick(i)}
          >
            <SuitButton suit={allSuit[i]} />
          </animated.div>
        ))}
      </Container>
    </HideShowTransition>
  );
}

export default SuitSelection;
