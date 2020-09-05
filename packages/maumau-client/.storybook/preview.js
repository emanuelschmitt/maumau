import React from 'react';
import GlobalStyles from '../src/styles/styles';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

const withGlobalStyles = (Story, context) => {
  return (
    <>
      <GlobalStyles />
      <Story {...context} />
    </>
  );
};
export const decorators = [withGlobalStyles];
