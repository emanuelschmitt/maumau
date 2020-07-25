import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack, { WatchIgnorePlugin } from 'webpack';
import WebpackManifestPlugin from 'webpack-manifest-plugin';
import WebpackBar from 'webpackbar';

const BROWSER_TARGETS = ['> 5% in alt-EU'];

export default (): webpack.Configuration => {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const devtool = mode === 'production' ? 'source-map' : 'inline-source-map';

  return {
    mode,
    entry: {
      main: path.resolve(__dirname, 'src/main.ts'),
    },
    output: {
      path: path.resolve(__dirname, 'bundle'),
      filename: mode === 'production' ? '[name]/[hash].bundle.js' : '[name]/bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', 'mjs', '.gql', '.graphql'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                cacheDirectory: true,
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        browsers: BROWSER_TARGETS,
                      },
                      modules: false, // Allows webpack to handle modules.
                      corejs: 3,
                      useBuiltIns: 'usage', // https://babeljs.io/docs/en/babel-preset-env#usebuiltins-usage
                    },
                  ],
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
                plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.ejs'), // path to your index.ejs
      }),
      new WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
      new WebpackManifestPlugin({
        writeToFileEmit: true,
      }),
      new WebpackBar(),
    ],
    devtool,
    //@ts-ignore
    devServer: {
      host: '0.0.0.0',
      contentBase: [path.join(__dirname, 'bundle'), path.join(__dirname, 'public')],
      contentBasePublicPath: '/static',
      port: 9000,
      historyApiFallback: true,
    },
  };
};
