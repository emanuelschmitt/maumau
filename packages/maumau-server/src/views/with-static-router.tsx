import React from 'react';
import { StaticRouter } from 'react-router-dom';

/**
 * Higher-order component (HOC) that provides the static router for server-side rendering.
 *
 * @param args
 * @param args.location Location instance for React Router.
 * @param args.routerContext Context object for React Router.
 */
export default function withStaticRouter(args: { location: string; routerContext: object }) {
  return <P extends {}>(WrappedComponent: React.ComponentType<P>): React.StatelessComponent<P> => (props) => {
    console.log('rendering static router');
    return (
      <StaticRouter location={args.location} context={args.routerContext}>
        <WrappedComponent {...props} />
      </StaticRouter>
    );
  };
}
