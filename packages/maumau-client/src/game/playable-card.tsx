import { Card as TCard } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import { TranslateUpAndSound } from '../animations/translate-up-and-sound';
import PlainButton from '../ui/plain-button';

import Card from './card';

const Button = styled(PlainButton)`
  border-radius: 8px;
  transition: all 0.25s ease;

  &:hover:enabled {
    cursor: pointer;
  }
`;

export type Props = {
  card: TCard;
  buttonProps?: React.HTMLProps<HTMLButtonElement>;
};

function PlayableCard({ card, buttonProps }: Props) {
  return (
    <TranslateUpAndSound disabled={buttonProps?.disabled}>
      <Button {...(buttonProps as any)}>
        <Card rank={card.rank} suit={card.suit} />
      </Button>
    </TranslateUpAndSound>
  );
}

export default PlayableCard;
