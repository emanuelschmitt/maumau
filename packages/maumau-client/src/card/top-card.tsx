import { Card } from 'maumau-server/src/types';
import React from 'react';
import styled from 'styled-components';

import Button from '../button';

import { cardStyle } from './style';
import { getCardAssetUrlByCard } from './utils';

const Frame = styled(Button)<{ url: string }>(({ url }) => ({
  ...cardStyle,
  background: `url('${url}')`,
  backgroundSize: 'cover',
}));

type Props = {
  card: Card;
};

function TopCard({ card }: Props) {
  return <Frame url={getCardAssetUrlByCard(card)} />;
}

export default TopCard;
