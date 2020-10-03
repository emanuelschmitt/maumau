import React from 'react';
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom';

const GA_TRACKING_IDENTIFIER = 'UA-179551039-1';

ReactGA.initialize(GA_TRACKING_IDENTIFIER);

function Tracking() {
  const history = useHistory();

  React.useEffect(() => {
    // send the initial page view to tracking
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);

    return history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    });
  }, [history]);

  return <React.Fragment />;
}

export default Tracking;
