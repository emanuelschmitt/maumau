import React from 'react';
import { HelmetData } from 'react-helmet';

export type Script = { file: string; attrs?: object };

export type Props = {
  html: string;
  css: React.ReactNode;
  helmetData: HelmetData;
  scripts: Script[];
};

/**
 * Static HTML root view.
 */
export default class StaticRoot extends React.Component<Props> {
  public render() {
    const { scripts, css, html, helmetData } = this.props;
    const { htmlAttributes, bodyAttributes } = helmetData;
    return (
      <html lang="en" {...htmlAttributes.toString()}>
        <head>
          <meta charSet="utf-8" />
          <title>Mau Mau | Epic Game</title>
          {helmetData.title.toComponent()}
          {helmetData.meta.toComponent()}
          {helmetData.link.toComponent()}
          {css}
        </head>

        <body {...bodyAttributes.toString()}>
          <main id="main" dangerouslySetInnerHTML={{ __html: html }} />
          {scripts.map(({ file, attrs = {} }) => (
            <script key={file} src={`/${file}`} {...attrs} />
          ))}
        </body>
      </html>
    );
  }
}
