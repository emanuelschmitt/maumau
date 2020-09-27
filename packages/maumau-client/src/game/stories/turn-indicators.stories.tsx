import React from 'react';

import TurnIndicator from '../turn-indicator';

export default {
  title: 'Game/Turn Indicator',
  component: TurnIndicator,
};

export const Default: React.SFC<{}> = () => <TurnIndicator show />;
