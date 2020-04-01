/**
 * Webpack config for production electron main process
 */

// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('../utils/paths');
const env = require('../utils/env');
const baseConfig = require('../webpack.config.base');

const { dependencies } = require(paths.appPackageJson);

module.exports = merge.smart(baseConfig, {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-main',

  entry: [env.injectCovReport && paths.appCovReportClient, paths.appSrcEntry].filter(Boolean),

  output: {
    path: paths.appDist,
    publicPath: './dist/',
    filename: 'main.prod.js',
  },

  externals: [...Object.keys(dependencies || {})],

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
        cache: true,
      }),
    ],
  },

  plugins: [],

  node: {
    __dirname: false,
    __filename: false,
  },
});
