import React from 'react';
import styled, { keyframes } from 'styled-components';

import MauMauLogoIcon from '../icons/maumau-logo';
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
  font-size: 3em;
  background: #262626;
  border: 8px solid white;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
    box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.25);
  }
`;

export const zoomIn = keyframes`
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const Badge = styled.div`
  background: red;
  color: white;
  padding: 7px 10px;
  font-size: 0.35em;
  position: absolute;
  top: 10px;
  right: -25px;
  z-index: 1;
  border-radius: 8px;
  animation: ${zoomIn} 0.25s ease 0s 1;
`;

type CardBackProps = {
  cardBadge?: string;
  buttonProps?: React.HTMLProps<HTMLButtonElement>;
};

function CardBack({ cardBadge, buttonProps }: CardBackProps) {
  return (
    <Container {...(buttonProps as any)}>
      {cardBadge && <Badge>{cardBadge}</Badge>}
      <MauMauLogoIcon />
    </Container>
  );
}

export default CardBack;
