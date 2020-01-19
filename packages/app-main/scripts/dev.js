//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const debug = require('debug')('app-main');
const path = require('path');
// const { spawn } = require('child_process');
const createWebpackCompiler = require('./utils/createWebpackCompiler');
// const clearConsole = require('./utils/clearConsole');
const pollingRenderer = require('./utils/pollingRenderer');
const ensureExternals = require('./utils/ensureExternals');
const getElectronRunner = require('./utils/getElectronRunner');
const webpackConfig = require('../webpack.config.dev');

const entry = path.join(__dirname, '../dist/main.dev.js');

(async () => {
  let compiledSuccess = null;

  const runElectron = getElectronRunner({
    //  重复调用时，是否自动重载 Electron
    autoReload: true,
    //  入口文件
    entry,
    //  electron 运行的参数
    args: [],
  });

  debug('start polling app-renderer status');
  const result = await pollingRenderer();
  if (!result) {
    debug('app-renderer failed to response')
    return;
  }

  const compiler = createWebpackCompiler({
    config: {
      ...webpackConfig,
      externals: ensureExternals(webpackConfig.externals),
    },
    useTypeScript: false, //  FIXME:
    tscCompileOnError: true,
    onCompiled: (success, stats) => {
      if (compiledSuccess === null) {
        //  首次编译
        if (success) {
          debug('initial compile successfully');
          //  成功则启动 Electron
          runElectron(stats.hash);
        } else {
          debug('initial compile failed');
          //  do nothing
        }
      } else if (success) {
        debug('re-compile successfully');
        //  当前编译成功了，给出提示 “按 R 键重启”
        runElectron(stats.hash);
      } else {
        debug('re-compile failed');
        //  当前编译失败了，给出错误提示
      }
      compiledSuccess = success;
    }
  });

  compiler.watch({
    aggregateTimeout: 300,
    poll: undefined,
  }, () => {});
})();
