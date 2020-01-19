/**
 * Webpack config for production electron main process
 */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('../../configs/webpack.config.base');
const { dependencies } = require('./package.json');

module.exports = merge.smart(baseConfig, {
  devtool: 'eval-source-map',

  mode: 'development',

  target: 'electron-main',

  entry: [
    path.join(__dirname, './src/index'),
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: './dist/',
    filename: 'main.dev.js'
  },

  externals: [
    ...Object.keys(dependencies),
  ],

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
    __filename: false
  }
});
