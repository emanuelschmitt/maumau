import { Request, Response } from 'express';
import { getClientStatics } from 'maumau-client';
import MainRoot from 'maumau-client/src/main-root';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import StaticRoot from '../views/static-root';

const statics = getClientStatics();

export function ssrHandler(request: Request, response: Response) {
  const rootElement = React.createElement(MainRoot);

  const sheet = new ServerStyleSheet();
  const html = ReactDOM.renderToString(sheet.collectStyles(rootElement));
  const css = sheet.getStyleElement();

  const staticElement = React.createElement(StaticRoot, {
    html,
    css,
    scripts: [{ file: `bundle/${statics.bundle.filePath}` }],
  });

  sheet.seal();

  return response.send('<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(staticElement));
}
