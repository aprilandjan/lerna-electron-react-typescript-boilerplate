/**
 * Base webpack config used across other specific configs
 */

// const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const paths = require('./utils/paths');
const env = require('./utils/env');
const logger = require('./utils/logger');

const isEnvDevelopment = process.env.NODE_ENV === 'development';

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
    filename: 'index.js',
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
        async: isEnvDevelopment,
        typescript: {
          typescriptPath: require.resolve('typescript'),
          configOverwrite: {
            compilerOptions: {
              // FIXME: maybe in prod no need to generate sourcemap?
              sourceMap: true,
              skipLibCheck: true,
              inlineSourceMap: false,
              declarationMap: false,
              noEmit: true,
              incremental: true,
              checkJs: false,
              allowJs: false,
            },
          },
          context: paths.appPath,
          diagnosticOptions: {
            syntactic: true,
          },
          // `build` and `mode` true are both needed
          // if we want to generate d.ts automatically
          // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/663
          build: true,
          mode: 'write-dts',
        },
        issue: {
          include: [{ file: '../**/src/**/*.{ts,tsx}' }, { file: '**/src/**/*.{ts,tsx}' }],
          exclude: [{ file: '**/src/**/__tests__/**' }, { file: '**/src/**/?(*.){spec|test}.*' }],
        },
        logger: {
          infrastructure: 'silent',
          // add scope prefix
          issues: {
            info: logger.info,
            log: logger.info,
            error: logger.info,
          },
        },
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
