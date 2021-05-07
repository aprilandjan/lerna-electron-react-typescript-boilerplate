//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const paths = require('../utils/paths');
const env = require('../utils/env');
const logger = require('../utils/logger');
const createReadline = require('../utils/createReadline');
const getElectronRunner = require('../utils/getElectronRunner');
const webpackConfig = require('./webpack.config.dev');
const webpackDev = require('../utils/webpackDev');
const ipc = require('../utils/ipc');
const clearConsole = require('../utils/clearConsole');

let compiledSuccess = null;
let compileHash = null;

const electronRunner = getElectronRunner({
  entry: paths.appMainDev,
  args: [],
});

const rl = createReadline({
  R: {
    desc: 'restart electron',
    callback: () => {
      if (!compiledSuccess) {
        return;
      }
      clearConsole(true);
      logger.info('restart electron...');
      electronRunner.start();
    },
  },
  Q: {
    desc: 'quit electron',
    callback: () => {
      logger.info('quit electron...');
      electronRunner.exit();
    },
  },
  C: {
    desc: 'clear console',
    callback: () => {
      clearConsole(true);
      rl.prompt();
    },
    disable: !process.stdout.isTTY,
  },
  X: {
    desc: 'exit dev process',
    callback: () => {
      logger.info('exit dev...');
      process.exit(1);
    },
  },
});

function promptReload() {
  if (!env.electronAutoStart) {
    return;
  }
  rl.prompt();
}

electronRunner.setExitCallback(promptReload);

async function startWebpackDev() {
  webpackDev(webpackConfig, (success, stats) => {
    if (compiledSuccess === null) {
      //  首次编译
      if (success) {
        compileHash = stats.hash;
        logger.debug('initial compile successfully');
        //  成功则启动 Electron
        electronRunner.start();
        promptReload();
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
        electronRunner.start();
      } else {
        promptReload();
      }
    } else {
      logger.debug('re-compile failed');
      //  当前编译失败了，给出错误提示
    }
    compiledSuccess = success;
  });
}

(async () => {
  //  如果是并行开发才需要等待
  if (process.env.MONO_REPO_DEV) {
    await ipc.waitClientsReady();
  }

  startWebpackDev();
})();
