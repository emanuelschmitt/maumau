import express, { Request, Response } from 'express';
import { getClientStatics } from 'maumau-client';
import MainRoot from 'maumau-client/src/main-root';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Helmet, { HelmetData } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';

import { logger } from '../server/logger';
import StaticRoot from '../views/static-root';
import withStaticRouter from '../views/with-static-router';

export default class ServerSideRenderController {
  public router = express.Router();
  public static statics = getClientStatics();
  public static basePath: string = '/';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use('^/static', express.static(ServerSideRenderController.statics.publicDirectory));
    this.router.use('^/bundle', express.static(ServerSideRenderController.statics.bundleDirectory));
    this.router.get('^/*', this.clientHandler);
  }

  private clientHandler = (request: Request, response: Response) => {
    const routerContext: { url?: string; status?: number } = {};
    const Main = withStaticRouter({ location: request.url, routerContext })(MainRoot);

    const { html, css, helmetData } = this.renderStatics(Main);

    const staticElement = React.createElement(StaticRoot, {
      html,
      css,
      helmetData,
      scripts: ServerSideRenderController.statics.bundles.map((bundle) => ({
        file: `bundle/${bundle.filePath}`,
      })),
    });

    if (routerContext.url) {
      response.redirect(routerContext.url);
    }

    if (routerContext.status === 404) {
      response.status(routerContext.status);
    }

    return response.send('<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(staticElement));
  };

  private renderStatics<P>(
    component: React.FunctionComponent<P>,
  ): { html: string; css: React.ReactNode; helmetData: HelmetData } {
    const rootElement = React.createElement(component);
    const sheet = new ServerStyleSheet();

    try {
      const html = ReactDOM.renderToString(sheet.collectStyles(rootElement));
      const css = sheet.getStyleElement();
      const helmetData = Helmet.renderStatic();

      return { html, css, helmetData };
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
