/* eslint global-require: off, import/no-dynamic-require: off */
/**
 * Webpack config for production electron main process
 */
const merge = require('webpack-merge');
const baseConfig = require('../webpack.config.base');
const env = require('../utils/env');
const ensureNodeExternals = require('../utils/ensureNodeExternals');

const isDev = process.env.NODE_ENV === 'development';

module.exports = merge.smart(baseConfig, {
  devtool: isDev ? 'inline-source-map' : 'source-map',
  target: 'node',
  output: {
    filename: 'index.js',
    // https://gist.github.com/jarshwah/389f93f2282a165563990ed60f2b6d6c
    // https://webpack.js.org/configuration/output/#outputdevtoolmodulefilenametemplate
    devtoolModuleFilenameTemplate: env.debugElectronInVSC
      ? 'file:///[absolute-resource-path]'
      : undefined,
  },

  externals: ensureNodeExternals(),

  optimization: {
    noEmitOnErrors: true,
  },

  plugins: [],

  node: {
    __dirname: false,
    __filename: false,
  },
});
