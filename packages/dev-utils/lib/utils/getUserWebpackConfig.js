const fs = require('fs-extra');
const paths = require('./paths');
const logger = require('./logger');

/** 读取用户目录下的 webpack config */
module.exports = function getUserWebpackConfig() {
  let config;
  try {
    if (fs.existsSync(paths.appWebpackConfig)) {
      logger.debug('user webpack config exist, load it');
      config = require(paths.appWebpackConfig);
    }
  } catch (e) {
    logger.debug('user webpack config load failed');
    config = {};
  }
  return config;
};
