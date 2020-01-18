/* eslint global-require: off, import/no-dynamic-require: off */

/**
 * Builds the DLL for development electron renderer process
 */

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('../../configs/webpack.config.base');
const { dependencies } = require('./package.json');

const dllPath = path.join(__dirname, 'dll');

module.exports = merge.smart(baseConfig, {
  // context: path.join(__dirname, '..'),

  devtool: 'eval',

  mode: 'development',

  target: 'electron-renderer',

  externals: ['fsevents', 'crypto-browserify'],

  /**
   * Use `module` from `webpack.config.dev.js`
   */
  module: require('./webpack.config.dev').module,

  entry: {
    renderer: Object.keys(dependencies || {})
  },

  output: {
    library: 'renderer',
    path: dllPath,
    filename: '[name].dev.dll.js',
    libraryTarget: 'var'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dllPath, '[name].json'),
      name: '[name]',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        // context: path.join(__dirname, '..'),
        output: {
          path: dllPath,
        }
      }
    }),
  ]
});
