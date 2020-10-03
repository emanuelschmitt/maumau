import React from 'react';

import SuitSelectDialog from '../suit-select-dialog';

export default {
  title: 'Game/Suit select Dialog',
  component: SuitSelectDialog,
};

export const Default: React.FunctionComponent<{}> = (args) => <SuitSelectDialog {...(args as any)} />;
