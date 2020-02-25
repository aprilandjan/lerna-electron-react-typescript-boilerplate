//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

// const path = require('path');
const paths = require('../utils/paths');
const logger = require('../utils/logger');
// const clearConsole = require('./utils/clearConsole');
const pollingRenderer = require('../utils/pollingRenderer');
const ensureExternals = require('../utils/ensureExternals');
const getElectronRunner = require('../utils/getElectronRunner');
const webpackConfig = require('./webpack.config.dev');
const webpackDev = require('../utils/webpackDev');

(async () => {
  let compiledSuccess = null;

  const runElectron = getElectronRunner({
    //  重复调用时，是否自动重载 Electron
    autoReload: true,
    //  入口文件
    entry: paths.appMainDev,
    //  electron 运行的参数
    args: [],
  });

  //  如果是并行开发才需要等待
  if (process.env.MONO_REPO_DEV) {
    logger.debug('start polling renderer dev server status');
    const result = await pollingRenderer();
    if (!result) {
      logger.info('renderer dev server failed to response');
      return;
    }
  }

  webpackDev(
    {
      ...webpackConfig,
      externals: ensureExternals(webpackConfig.externals),
    },
    (success, stats) => {
      if (process.argv.includes('--only')) {
        logger.info('do not run electron since `--only` flag founded.');
        return;
      }
      if (compiledSuccess === null) {
        //  首次编译
        if (success) {
          logger.debug('initial compile successfully');
          //  成功则启动 Electron
          runElectron(stats.hash);
        } else {
          logger.debug('initial compile failed');
          //  do nothing
        }
      } else if (success) {
        logger.debug('re-compile successfully');
        //  当前编译成功了，给出提示 “按 R 键重启”
        runElectron(stats.hash);
      } else {
        logger.debug('re-compile failed');
        //  当前编译失败了，给出错误提示
      }
      compiledSuccess = success;
    }
  );
})();
