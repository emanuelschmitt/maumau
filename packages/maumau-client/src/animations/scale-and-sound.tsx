import randomBetween from 'maumau-server/src/utils/random-between';
import React from 'react';
import { animated, useSpring, config } from 'react-spring';

import useSounds from '../common/use-sounds';

import { useBlopp } from './use-blopp';

type Props = {
  disabled?: boolean;
  timing?: number;
};

export function ScaleAndSound({ disabled = false, timing = 150, children }: React.PropsWithChildren<Props>) {
  const [playSound] = useSounds('bubble');

  const { isBlopped, setIsBlopped } = useBlopp({ timing });

  const style = useSpring({
    transform: isBlopped ? `scale(1.05) rotate(${randomBetween(-10, 10)}deg)` : `scale(1) rotate(0deg)`,
    config: config.wobbly,
  });

  return (
    <animated.div
      onMouseEnter={() => {
        if (disabled) {
          return;
        }
        playSound({ playbackRate: 2 });
        setIsBlopped(true);
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
      style={style}
    >
      {children}
    </animated.div>
  );
}
