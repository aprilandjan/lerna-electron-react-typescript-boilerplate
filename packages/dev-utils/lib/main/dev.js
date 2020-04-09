//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

// const path = require('path');
const chalk = require('chalk');
const paths = require('../utils/paths');
const env = require('../utils/env');
const logger = require('../utils/logger');
// const clearConsole = require('./utils/clearConsole');
const pollingRenderer = require('../utils/pollingRenderer');
const ensureExternals = require('../utils/ensureExternals');
const createReadline = require('../utils/createReadline');
const getElectronRunner = require('../utils/getElectronRunner');
const webpackConfig = require('./webpack.config.dev');
const webpackDev = require('../utils/webpackDev');

(async () => {
  let compiledSuccess = null;
  let compileHash = null;

  const runElectron = getElectronRunner({
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

  const rl = createReadline({
    text: `${logger.prefix} You can press ${chalk.green('R')} (and then ${chalk.green(
      'Enter'
    )}) to restart electron at any time\n`,
    matcher: 'R',
    callback: () => {
      if (!compiledSuccess) {
        return;
      }
      logger.info('restart electron');
      runElectron();
    },
  });

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
          compileHash = stats.hash;
          logger.debug('initial compile successfully');
          //  成功则启动 Electron
          runElectron();
          rl.prompt();
        } else {
          logger.debug('initial compile failed');
          //  do nothing
        }
      } else if (success) {
        logger.debug('re-compile successfully');
        //  编译结果没有变化
        if (compileHash === stats.hash) {
          logger.debug('do not run electron because of same hash', stats.hash);
          return;
        }
        compileHash = stats.hash;
        if (env.electronAutoReload) {
          //  自动重启
          runElectron();
        } else {
          rl.prompt();
        }
      } else {
        logger.debug('re-compile failed');
        //  当前编译失败了，给出错误提示
      }
      compiledSuccess = success;
    }
  );
})();
