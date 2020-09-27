import React from 'react';
import { useSpring, animated, config } from 'react-spring';

type HideShowTransitionProps = {
  show: boolean;
  children?: React.ReactNode;
};

function HideShowTransition({ show, children }: HideShowTransitionProps) {
  const props = useSpring({
    from: { opacity: show ? 0 : 1 },
    to: { opacity: show ? 1 : 0 },
    delay: 100,
    config: config.stiff,
  });
  return <animated.div style={props}>{children}</animated.div>;
}

export default HideShowTransition;
