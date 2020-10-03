import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export default function withBrowserRoot() {
  return <P extends {}>(WrappedComponent: React.ComponentType<P>): React.FunctionComponent<P> => (props) => {
    return (
      <BrowserRouter>
        <WrappedComponent {...props} />
      </BrowserRouter>
    );
  };
}
