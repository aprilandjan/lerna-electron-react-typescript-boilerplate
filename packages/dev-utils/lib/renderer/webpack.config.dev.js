// const path = require('path');
// const fs = require('fs-extra');
const webpack = require('webpack');
// const chalk = require('chalk');
const merge = require('webpack-merge');
const paths = require('../utils/paths');
const env = require('../utils/env');
const getCSSModuleLocalIdent = require('../utils/getCSSModuleLocalIdent');
const baseConfig = require('../webpack.config.base');

const cssSourcemap = false;

module.exports = merge.smart(baseConfig, {
  devtool: 'cheap-module-source-map',

  mode: 'development',

  target: 'electron-renderer',

  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${env.host}:${env.port}/`,
    'webpack/hot/only-dev-server',
    paths.appSrcEntry,
  ],

  output: {
    publicPath: `http://${env.host}:${env.port}/`,
    filename: 'renderer.dev.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },

  module: {
    rules: [
      {
        //  css find order
        oneOf: [
          //  the css in appSrc, which not started with global
          //  are treated as scoped style
          {
            test: /^((?!\.global).)*\.css$/,
            include: paths.appSrc,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                  sourceMap: cssSourcemap,
                  importLoaders: 1,
                },
              },
            ],
          },
          //  other css, no matter where it is, node_modules for example
          //  are treated as non-scoped style
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: cssSourcemap,
                },
              },
            ],
          },
          //  the sass in appSrc, which not started with global
          //  are treated as scoped style
          {
            test: /\.global\.(scss|sass)$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: cssSourcemap,
                },
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
          //  other sass, no matter where it is, node_modules for example
          //  are treated as non-scoped style
          {
            test: /.(scss|sass)$/,
            include: paths.appSrc,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                  sourceMap: cssSourcemap,
                  importLoaders: 1,
                },
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: 'assets/imgs/[name].[hash:8].[ext]',
          },
        },
      },
      // Audios
      {
        test: /\.(ogg|mp3|mp4|wav|mpe?g)$/i,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: 'assets/audios/[name].[hash:8].[ext]',
          },
        },
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: 'assets/fonts/[name].[hash:8].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    //  make it always ready
    new webpack.DllReferencePlugin({
      context: paths.appPath,
      manifest: paths.appDLLManifest,
      sourceType: 'var',
    }),
    // https://webpack.js.org/plugins/hot-module-replacement-plugin/
    new webpack.HotModuleReplacementPlugin({
      // multiStep: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ].filter(Boolean),

  node: {
    __dirname: false,
    __filename: false,
  },
});
