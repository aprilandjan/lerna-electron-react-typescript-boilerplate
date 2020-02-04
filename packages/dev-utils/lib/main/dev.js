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
const createWebpackCompiler = require('../utils/createWebpackCompiler');
// const clearConsole = require('./utils/clearConsole');
const pollingRenderer = require('../utils/pollingRenderer');
const ensureExternals = require('../utils/ensureExternals');
const getElectronRunner = require('../utils/getElectronRunner');
const webpackConfig = require('./webpack.config.dev');

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

  if (!process.argv.includes('--only')) {
    logger.debug('start polling app-renderer status');
    const result = await pollingRenderer();
    if (!result) {
      logger.debug('app-renderer failed to response');
      return;
    }
  }

  const compiler = createWebpackCompiler({
    config: {
      ...webpackConfig,
      externals: ensureExternals(webpackConfig.externals),
    },
    useTypeScript: true,
    tscCompileOnError: false,
    onCompiled: (success, stats) => {
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
    },
  });

  compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    () => {}
  );
})();
