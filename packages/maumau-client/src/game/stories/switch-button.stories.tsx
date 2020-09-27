import React from 'react';

import SwitchButton from '../switch-button';

export default {
  title: 'Game/Switch button',
  component: SwitchButton,
};

export const Default: React.SFC<{}> = () => <SwitchButton onClick={() => null} show={true} />;
export const Hide: React.SFC<{}> = () => <SwitchButton onClick={() => null} show={false} />;
