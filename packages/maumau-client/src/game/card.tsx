import { Rank, Suit } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import ClubsIcon from '../icons/clubs';
import DiamondsIcon from '../icons/diamonds';
import HeartsIcon from '../icons/hearts';
import SpadesIcon from '../icons/spades';
import PlainButton from '../ui/plain-button';

const Container = styled(PlainButton)`
  position: relative;
  height: 160px;
  width: 104px;
  background: white;
  box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  border-radius: 8px;
  user-select: none;
  transition: all 0.25s ease;

  &:hover {
    cursor: pointer;
    box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.25);
  }
`;

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
  buttonProps?: React.HTMLProps<HTMLButtonElement>;
};

function ComponentIconBySuit(suit: Suit) {
  switch (suit) {
    case Suit.CLUBS: {
      return ClubsIcon;
    }
    case Suit.HEARTS: {
      return HeartsIcon;
    }
    case Suit.DIAMONDS: {
      return DiamondsIcon;
    }
    case Suit.SPADES: {
      return SpadesIcon;
    }
  }
}

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

function getColorBySuit(suit: Suit) {
  switch (suit) {
    case Suit.CLUBS:
    case Suit.SPADES:
      return '#262626';
    case Suit.DIAMONDS:
    case Suit.HEARTS:
      return 'red';
  }
}

function Card({ rank, suit, buttonProps }: Props) {
  const Suit = ComponentIconBySuit(suit);
  const color = getColorBySuit(suit);
  const rankText = getTextByRank(rank);

  return (
    <Container style={{ color }} {...(buttonProps as any)}>
      <TopLeft>
        {rankText}
        <Suit />
      </TopLeft>
      <BottomRight>
        <Suit />
        {rankText}
      </BottomRight>
      <Suit style={{ fontSize: '2em' }} />
    </Container>
  );
}

export default Card;
