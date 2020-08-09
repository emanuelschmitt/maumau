import React from 'react';
import ReactDOM from 'react-dom';

import MainRoot from './main-root';
import withBrowserRoot from './with-browser-root';

const BrowserRoot = withBrowserRoot()(MainRoot);

const element = React.createElement(BrowserRoot);
ReactDOM.hydrate(element, document.getElementById('main'));
