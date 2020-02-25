/* eslint global-require: off, import/no-dynamic-require: off */

/**
 * Builds the DLL for development electron renderer process
 */

// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const paths = require('../utils/paths');
const baseConfig = require('../webpack.config.base');

const { dependencies } = require(paths.appPackageJson);

module.exports = merge.smart(baseConfig, {
  // context: path.join(__dirname, '..'),

  devtool: 'eval',

  mode: 'development',

  target: 'electron-renderer',

  //  来自 renderer 的直接依赖做成 dependency
  externals: ['fsevents', 'crypto-browserify'],

  /**
   * Use `module` from `webpack.config.dev.js`
   */
  module: require('./webpack.config.dev').module,

  entry: {
    renderer: Object.keys(dependencies || {}),
  },

  output: {
    library: 'renderer',
    path: paths.appDLL,
    filename: '[name].dev.dll.js',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.DllPlugin({
      path: paths.appDLLManifest,
      name: '[name]',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: paths.appPath,
        output: {
          path: paths.appDLL,
        },
      },
    }),
  ],
});
