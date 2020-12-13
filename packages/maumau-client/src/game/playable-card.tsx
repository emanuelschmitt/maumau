import { Card as TCard } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import useSounds from '../common/use-sounds';
import PlainButton from '../ui/plain-button';

import Card from './card';

const Button = styled(PlainButton)`
  border-radius: 8px;
  transition: all 0.25s ease;

  &:hover:enabled {
    cursor: pointer;
  }

  &:hover {
    transform: translateY(${(props) => (props.disabled ? '0' : '-30px')});
    box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.25);
    z-index: 100;
  }
`;

export type Props = {
  card: TCard;
  buttonProps?: React.HTMLProps<HTMLButtonElement>;
};

function PlayableCard({ card, buttonProps }: Props) {
  const [play] = useSounds('bubble');

  return (
    <div
      onMouseEnter={() => {
        play({ playbackRate: 2 });
      }}
      onClick={() => {
        playSound({ playbackRate: 1 });
      }}
    >
      <Button {...(buttonProps as any)}>
        <Card rank={card.rank} suit={card.suit} />
      </Button>
    </div>
  );
}

export default PlayableCard;
