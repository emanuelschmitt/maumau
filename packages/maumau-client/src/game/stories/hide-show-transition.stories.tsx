import React from 'react';

import HideShowTransition from '../hide-show-transition';

export default {
  title: 'Utils/Hide show transition',
  component: HideShowTransition,
  argTypes: {
    show: { control: 'boolean' },
  },
};

export const Default: React.SFC<{}> = (args) => (
  <HideShowTransition {...(args as any)}>
    <h1>Hello</h1>
  </HideShowTransition>
);
