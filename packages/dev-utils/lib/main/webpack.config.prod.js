/**
 * Webpack config for production electron main process
 */

// const path = require('path');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('../utils/paths');
const ensureNodeExternals = require('../utils/ensureNodeExternals');
const baseConfig = require('../webpack.config.base');

module.exports = merge.smart(baseConfig, {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-main',

  entry: paths.appSrcEntry,

  output: {
    path: paths.appDist,
    publicPath: './dist/',
    filename: 'main.prod.js',
  },

  externals: [...ensureNodeExternals()],

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
