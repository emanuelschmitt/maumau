import React from 'react';

export type Script = { file: string; attrs?: object };

export type Props = {
  html: string;
  css: React.ReactNode;
  scripts: Script[];
};

/**
 * Static HTML root view.
 */
export default class StaticRoot extends React.Component<Props> {
  public render() {
    const { scripts, css, html } = this.props;
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Mau Mau | Epic Game</title>
          {css}
        </head>

        <body>
          <main id="main" dangerouslySetInnerHTML={{ __html: html }} />
          {scripts.map(({ file, attrs = {} }) => (
            <script key={file} src={`/${file}`} {...attrs} />
          ))}
        </body>
      </html>
    );
  }
}
