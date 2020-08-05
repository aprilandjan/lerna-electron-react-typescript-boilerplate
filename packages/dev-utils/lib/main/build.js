//  ensure env
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

const webpackConfig = require('./webpack.config.prod');
const webpackBuild = require('../utils/webpackBuild');

webpackBuild(webpackConfig).then(() => {
  //
});
