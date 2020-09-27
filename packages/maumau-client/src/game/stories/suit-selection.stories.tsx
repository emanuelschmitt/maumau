import React from 'react';

import SuitSelectionion from '../suit-selection';

export default {
  title: 'Game/Suit selection',
  component: SuitSelectionion,
  argTypes: {
    show: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export const Default: React.SFC<{}> = (args) => <SuitSelectionion {...(args as any)} />;
