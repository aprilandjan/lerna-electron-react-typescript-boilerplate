/* eslint global-require: off, import/no-dynamic-require: off */
/**
 * Webpack config for production electron main process
 */

// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const paths = require('../utils/paths');
const baseConfig = require('../webpack.config.base');

const { dependencies } = require(paths.appPackageJson);

module.exports = merge.smart(baseConfig, {
  devtool: 'eval-source-map',

  mode: 'development',

  target: 'electron-main',

  entry: [paths.appSrcEntry],

  output: {
    path: paths.appDist,
    publicPath: './dist/',
    filename: 'main.dev.js',
  },

  externals: [...Object.keys(dependencies)],

  optimization: {
    //  do not emit resources if error
    noEmitOnErrors: true,
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
});
