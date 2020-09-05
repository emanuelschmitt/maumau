import React from 'react';

import CardBack from '../card-back';

export default {
  title: 'Game/Card - Back',
  component: CardBack,
};

export const Default: React.SFC<{}> = () => <CardBack />;
export const WithBadge: React.SFC<{}> = () => <CardBack cardBadge="+2" />;
