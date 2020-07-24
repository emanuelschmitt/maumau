import React from 'react';
import styled from 'styled-components';

import { cardStyle } from './style';
import { getCardAssetForStackCard } from './utils';

const Frame = styled.div<{ url: string }>(({ url }) => ({
  ...cardStyle,
  background: `url('${url}')`,
  backgroundSize: 'cover',
}));

function StackCard() {
  return <Frame url={getCardAssetForStackCard()} />;
}

export default StackCard;
