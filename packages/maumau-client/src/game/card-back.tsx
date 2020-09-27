import React from 'react';
import styled from 'styled-components';

import MauMauLogoIcon from '../icons/maumau-logo';

import PlainCard from './plain-card';

const Container = styled(PlainCard)`
  transition: all 0.25s ease;
  font-size: 3em;
  background: #262626;
  border: 8px solid white;
  box-sizing: border-box;
`;

function CardBack() {
  return (
    <Container>
      <MauMauLogoIcon />
    </Container>
  );
}

export default CardBack;
