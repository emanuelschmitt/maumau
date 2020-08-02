import express, { Request, Response } from 'express';
import { getClientStatics } from 'maumau-client';
import MainRoot from 'maumau-client/src/main-root';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import StaticRoot from '../views/static-root';

import { logger } from './logger';

const statics = getClientStatics();

/**
 * Render React element to html and css markup.
 */
function renderHTMLandCSS(): { html: string; css: React.ReactNode } {
  const rootElement = React.createElement(MainRoot);
  const sheet = new ServerStyleSheet();

  try {
    const html = ReactDOM.renderToString(sheet.collectStyles(rootElement));
    const css = sheet.getStyleElement();
    return { html, css };
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    sheet.seal();
  }
}

export function ssrHandler(request: Request, response: Response) {
  const { html, css } = renderHTMLandCSS();

  const staticElement = React.createElement(StaticRoot, {
    html,
    css,
    scripts: statics.bundles.map((bundle) => ({
      file: `bundle/${bundle.filePath}`,
    })),
  });

  return response.send('<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(staticElement));
}

export const router = express
  .Router()
  .get('/', ssrHandler)
  .use('/static', express.static(statics.publicDirectory))
  .use('/bundle', express.static(statics.bundleDirectory));
