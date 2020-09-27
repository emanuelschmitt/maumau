import React from 'react';

import Dialog from '../dialog';

export default {
  title: 'UI/Dialog',
  component: Dialog,
};

const Content = (
  <div>
    <h1>Some nice content</h1>
    <p>This is some next that sits next to the content</p>
  </div>
);

export const Default: React.FunctionComponent<{}> = () => <Dialog>{Content}</Dialog>;
export const WithClose: React.FunctionComponent<{}> = () => <Dialog onClose={() => null}>{Content}</Dialog>;
