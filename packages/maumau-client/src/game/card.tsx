import { Rank, Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import PlainCard from './plain-card';
import SuitIcon from './suit-icon';
import { getColorBySuit } from './utils/get-color-by-suit';

const TopLeft = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    margin-top: 4px;
  }
`;

const BottomRight = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    margin-bottom: 4px;
  }
`;

type Props = {
  rank: Rank;
  suit: Suit;
};

function getTextByRank(rank: Rank): string {
  switch (rank) {
    case Rank.ACE:
      return 'A';
    case Rank.EIGHT:
      return '8';
    case Rank.SEVEN:
      return '7';
    case Rank.JACK:
      return 'J';
    case Rank.KING:
      return 'K';
    case Rank.NINE:
      return '9';
    case Rank.QUEEN:
      return 'Q';
    case Rank.TEN:
      return '10';
  }
}

function Card({ rank, suit }: Props) {
  const color = getColorBySuit(suit);
  const rankText = getTextByRank(rank);

  return (
    <PlainCard style={{ color }}>
      <TopLeft>
        {rankText}
        <SuitIcon suit={suit} />
      </TopLeft>
      <BottomRight>
        <SuitIcon suit={suit} />
        {rankText}
      </BottomRight>
      <SuitIcon suit={suit} style={{ fontSize: '2em' }} />
    </PlainCard>
  );
}

export default Card;
