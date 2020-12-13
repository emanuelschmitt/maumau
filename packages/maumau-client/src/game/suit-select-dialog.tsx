import { Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import useSounds from '../common/use-sounds';
import Dialog from '../ui/dialog';

import SuitButton from './suit-button';

const Frame = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
`;

type Props = {
  onSelect: (suit: Suit) => void;
  onCancel: () => void;
};

const allSuites: Suit[] = [Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS, Suit.SPADES];

function SuitSelectDialog({ onSelect, onCancel }: Props) {
  const [playSound] = useSounds('bubble');
  return (
    <Dialog onClose={onCancel}>
      <Frame>
        {allSuites.map((s) => (
          <SuitButton
            suit={s}
            key={s}
            onClick={() => {
              playSound({ playbackRate: 3 });
              onSelect(s);
            }}
          />
        ))}
      </Frame>
    </Dialog>
  );
}

export default SuitSelectDialog;
