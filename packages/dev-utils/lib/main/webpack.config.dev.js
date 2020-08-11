/* eslint global-require: off, import/no-dynamic-require: off */
/**
 * Webpack config for production electron main process
 */

// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const paths = require('../utils/paths');
const baseConfig = require('../webpack.config.base');
const env = require('../utils/env');
const ensureExternals = require('../utils/ensureExternals');

const { dependencies } = require(paths.appPackageJson);

module.exports = merge.smart(baseConfig, {
  //  vscode support
  devtool: env.debugElectronInVSC ? 'inline-source-map' : 'eval-source-map',

  mode: 'development',

  target: 'electron-main',

  entry: [paths.appSrcEntry],

  output: {
    path: paths.appDist,
    publicPath: './dist/',
    filename: 'main.dev.js',
    // https://gist.github.com/jarshwah/389f93f2282a165563990ed60f2b6d6c
    // https://webpack.js.org/configuration/output/#outputdevtoolmodulefilenametemplate
    devtoolModuleFilenameTemplate: env.debugElectronInVSC
      ? 'file:///[absolute-resource-path]'
      : undefined,
  },

  //  app-main 依赖不需 webpack 打包
  externals: [...ensureExternals(), ...Object.keys(dependencies || {})],

  optimization: {
    //  do not emit resources if error
    noEmitOnErrors: true,
  },

  plugins: [],

  node: {
    __dirname: false,
    __filename: false,
  },
});
