import randomBetween from 'maumau-server/src/utils/random-between';
import React from 'react';
import { animated, useSpring, config } from 'react-spring';

import useSounds from '../common/use-sounds';

import { useBlopp } from './use-blopp';

type Props = {
  disabled?: boolean;
  timing?: number;
};

export function TranslateUpAndSound({ disabled = false, timing = 150, children }: React.PropsWithChildren<Props>) {
  const [playSound] = useSounds('bubble');
  const [isHovered, setIsHovered] = React.useState(false);

  const { isBlopped, setIsBlopped } = useBlopp({ timing });

  const y = isHovered ? '-30px' : '0px';
  const style = useSpring({
    transform: isBlopped
      ? `translate3d(0, ${y}, 0) scale(1.05) rotate(${randomBetween(-5, 5)}deg)`
      : `translate3d(0, ${y}, 0) scale(1) rotate(0deg)`,
    boxShadow: isBlopped
      ? `box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.25);`
      : `box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);`,
    config: config.stiff,
  });

  return (
    <animated.div
      onMouseEnter={() => {
        if (disabled) {
          return;
        }
        playSound({ playbackRate: 2 });
        setIsBlopped(true);
        setIsHovered(true);
      }}
      onClick={() => {
        if (disabled) {
          return;
        }
        playSound({
          playbackRate: 1,
        });
        setIsBlopped(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      style={style}
    >
      {children}
    </animated.div>
  );
}
