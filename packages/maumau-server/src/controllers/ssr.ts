import express, { Request, Response } from 'express';
import { getClientStatics } from 'maumau-client';
import MainRoot from 'maumau-client/src/main-root';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import { logger } from '../server/logger';
import StaticRoot from '../views/static-root';

export default class ServerSideRenderController {
  public router = express.Router();
  public static statics = getClientStatics();
  public static basePath: string = '/';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.clientHandler);
    this.router.use('/static', express.static(ServerSideRenderController.statics.publicDirectory));
    this.router.use('/bundle', express.static(ServerSideRenderController.statics.bundleDirectory));
  }

  private clientHandler = (request: Request, response: Response) => {
    const { html, css } = this.renderHTMLandCSS();

    const staticElement = React.createElement(StaticRoot, {
      html,
      css,
      scripts: ServerSideRenderController.statics.bundles.map((bundle) => ({
        file: `bundle/${bundle.filePath}`,
      })),
    });

    return response.send('<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(staticElement));
  };

  private renderHTMLandCSS(): { html: string; css: React.ReactNode } {
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

  public getRouter() {
    return this.router;
  }
}
