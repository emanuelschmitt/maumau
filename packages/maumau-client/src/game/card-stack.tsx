import React from 'react';
import { useTransition, animated, config } from 'react-spring';
import styled from 'styled-components';

import { ScaleAndSound } from '../animations/scale-and-sound';
import PlainButton from '../ui/plain-button';

import CardBack from './card-back';

const Button = styled(PlainButton)`
  position: relative;
  border-radius: 8px;

  &:hover:enabled {
    cursor: pointer;
    box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.25);
    z-index: 100;
  }
`;

const Badge = styled(animated.div)`
  background: red;
  color: white;
  padding: 7px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  position: absolute;
  top: 20px;
  right: -15px;
  z-index: 1;
  border-radius: 8px;
  width: 20px;
  height: 20px;
`;

type Props = {
  cardBadge?: string;
  buttonProps?: React.HTMLProps<HTMLButtonElement>;
};

function CardStack({ cardBadge, buttonProps }: Props) {
  const badges = Boolean(cardBadge) ? [cardBadge] : [];

  const transitions = useTransition(badges, (b) => b as string, {
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' },
    config: config.stiff,
  });

  return (
    <ScaleAndSound disabled={buttonProps?.disabled}>
      <Button {...(buttonProps as any)}>
        {transitions.map((transition) => (
          <Badge style={transition.props} key={transition.key}>
            {transition.item}
          </Badge>
        ))}
        <CardBack />
      </Button>
    </ScaleAndSound>
  );
}

export default CardStack;
