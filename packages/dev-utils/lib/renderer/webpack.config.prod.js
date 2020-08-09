/**
 * Build config for electron renderer process
 */

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('../utils/paths');
const getCSSModuleLocalIdent = require('../utils/getCSSModuleLocalIdent');
const baseConfig = require('../webpack.config.base');

const cssSourcemap = false;

module.exports = merge.smart(baseConfig, {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-renderer',

  entry: paths.appSrcEntry,

  output: {
    path: paths.appDist,
    publicPath: './',
    filename: 'renderer.prod.js',
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
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                  sourceMap: cssSourcemap,
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
                loader: MiniCssExtractPlugin.loader,
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
                loader: MiniCssExtractPlugin.loader,
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
                loader: MiniCssExtractPlugin.loader,
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
      // Images
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

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
        cache: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
      ignoreOrder: true,
    }),
  ],
});
