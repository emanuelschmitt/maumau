import React from 'react';

import OpponentPanel from '../opponent-panel';

export default {
  title: 'Game/Opponent panel',
  component: OpponentPanel,
};

export const Default: React.SFC<{}> = () => <OpponentPanel name="Lukas" cardAmount={7} />;
