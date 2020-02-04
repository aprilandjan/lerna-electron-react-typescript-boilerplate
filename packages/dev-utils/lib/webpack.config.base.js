/**
 * Base webpack config used across other specific configs
 */

const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const typescriptFormatter = require('./utils/typescriptFormatter');
const paths = require('./utils/paths');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            rootMode: 'upward',
          },
        },
      },
    ],
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: [path.join(__dirname, '..'), 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),

    new webpack.NamedModulesPlugin(),

    new ForkTsCheckerWebpackPlugin({
      // typescript: resolve.sync('typescript', {
      //   basedir: paths.appNodeModules,
      // }),
      typescript: require.resolve('typescript'),
      async: isEnvDevelopment,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      tsconfig: paths.appTsConfig,
      reportFiles: ['**', '!**/__tests__/**', '!**/?(*.)(spec|test).*'],
      silent: true,
      // The formatter is invoked directly in WebpackDevServerUtils during development
      formatter: isEnvProduction ? typescriptFormatter : undefined,
    }),
  ],
};
