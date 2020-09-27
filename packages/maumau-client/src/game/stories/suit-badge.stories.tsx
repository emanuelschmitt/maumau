import { Suit } from 'maumau-server/src/types';
import React from 'react';

import SuitBadge, { Props } from '../suit-badge';

export default {
  title: 'Game/Suit Badge',
  component: SuitBadge,
};

const props: Props = {
  suit: Suit.DIAMONDS,
};

export const Default: React.FunctionComponent<{}> = () => <SuitBadge {...props} />;
