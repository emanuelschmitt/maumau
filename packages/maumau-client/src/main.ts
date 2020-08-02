import React from 'react';
import ReactDOM from 'react-dom';

import MainRoot from './main-root';

const element = React.createElement(MainRoot);
ReactDOM.hydrate(element, document.getElementById('main'));
