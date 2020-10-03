import React from 'react';

import CardStack from '../card-stack';

export default {
  title: 'Game/Card Stack',
  component: CardStack,
};

export const Default: React.SFC<{}> = () => <CardStack />;
export const WithBadge: React.SFC<{}> = () => <CardStack cardBadge="+2" />;
