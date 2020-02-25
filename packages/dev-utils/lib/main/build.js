//  ensure env
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const logger = require('../utils/logger');
const paths = require('../utils/paths');
const webpackConfig = require('./webpack.config.prod');
const webpackBuild = require('../utils/webpackBuild');

webpackBuild(webpackConfig).then(() => {
  //  copy renderer files
  if (fs.existsSync(paths.appRendererDist)) {
    fs.copySync(paths.appRendererDist, paths.appMainDist, {
      dereference: true,
    });
    logger.info(`renderer bundle copied from ${paths.appRendererDist}`);
  } else {
    logger.info('renderer bundle not found. Need build renderer first');
  }
});
