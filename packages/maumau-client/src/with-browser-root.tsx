import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export default function withBrowserRoot() {
  return <P extends {}>(WrappedComponent: React.ComponentType<P>): React.StatelessComponent<P> => (props) => {
    return (
      <BrowserRouter>
        <WrappedComponent {...props} />
      </BrowserRouter>
    );
  };
}
