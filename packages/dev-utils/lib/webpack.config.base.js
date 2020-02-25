/**
 * Base webpack config used across other specific configs
 */

// const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const typescriptFormatter = require('./utils/typescriptFormatter');
const paths = require('./utils/paths');
const env = require('./utils/env');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: [/node_modules/],
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
    path: paths.appDist,
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    // modules: [path.join(paths.appPath, 'node_modules')],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: paths.appTsConfig,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      }),
    ],
  },

  plugins: [
    /** 获取注入到打包代码里的 env */
    new webpack.EnvironmentPlugin(env.getInjectedEnv()),

    new webpack.NamedModulesPlugin(),
    !env.disableTsCheck &&
      new ForkTsCheckerWebpackPlugin({
        // typescript: resolve.sync('typescript', {
        //   basedir: paths.appNodeModules,
        // }),
        typescript: require.resolve('typescript'),
        async: isEnvDevelopment,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        tsconfig: paths.appTsConfig,
        reportFiles: ['**/*.(ts|tsx)', '!**/__tests__/**', '!**/?(*.)(spec|test).*'],
        silent: true,
        // The formatter is invoked directly in WebpackDevServerUtils during development
        formatter: isEnvProduction ? typescriptFormatter : undefined,
      }),

    env.openAnalyzer && new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)(),

    env.deleteUnused &&
      new (require('./utils/unusedFilesWebpackPlugin'))({
        autoDelete: true,
        // Source directories
        directories: [paths.appSrc],
        // Exclude patterns
        exclude: [
          'assets/**/*',
          'components/**/*',
          'containers/**/*',
          '*.ts',
          '*.tsx',
          '*.d.ts',
          'package.json',
          // 'index.js'
        ],
      }),
  ].filter(Boolean),
};
