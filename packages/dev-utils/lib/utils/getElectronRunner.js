// const path = require('path');
const execa = require('execa');
const treeKill = require('tree-kill');
const exitHook = require('async-exit-hook');
const paths = require('./paths');
const logger = require('./logger');
const env = require('./env');
const chalk = require('chalk');

module.exports = function getElectronRunner(config = {}) {
  const { entry, args = [] } = config;

  let electronProcess = null;
  let autoKilled = false;
  let exitCallback = null;

  function kill() {
    if (electronProcess && electronProcess.killed) {
      logger.debug('electron process already killed');
      return Promise.resolve();
    }
    logger.debug('kill existed electron process');
    autoKilled = true;
    const pExit = new Promise(resolve => {
      electronProcess.on('exit', () => {
        resolve();
      });
    });
    const pKill = new Promise(resolve => {
      treeKill(electronProcess.pid, () => {
        resolve();
      });
    });
    return Promise.all([pExit, pKill]);
  }

  /**
   * 启动 Electron. 如果已有 Electron 进程了，则先关掉
   */
  async function run() {
    if (!env.electronAutoStart) {
      //  该信息会被 vscode background task 用来判断 dev-watch ready
      logger.info('do not run electron since `ELECTRON_AUTO_START` set as `false`.');
      return;
    }
    if (electronProcess) {
      logger.debug('reload electron process...');
      autoKilled = true;
      await kill();
    }
    electronProcess = startElectron();
  }

  function log(data, isError = false) {
    const lines = data.toString().split('\n');

    lines.forEach(line => {
      let text = line.trimRight();
      if (text === '') {
        return;
      }
      if (isError) {
        //  do not grep error outputs
        logger.info(`[electron] ${chalk.red(text)}`);
        return;
      }
      if (!env.grepElectron || text.includes(env.grepElectron)) {
        logger.info(`[electron] ${text}`);
      }
    });
  }

  function startElectron() {
    logger.debug('spawn new electron process');
    autoKilled = false;
    const p = execa('electron', [entry, '--inspect', ...args], {
      cwd: paths.appPath,
      preferLocal: true,
    });

    p.stdout.on('data', data => {
      log(data);
    });
    p.stderr.on('data', data => {
      log(data, true);
    });

    p.on('exit', (code, signal) => {
      p.removeAllListeners();
      if (autoKilled) {
        return;
      }
      if (env.exitDevElectronQuit) {
        logger.info('exit dev process');
        process.exit(1);
      } else {
        logger.info(`electron process exit with code ${code}`);
        electronProcess = null;
        if (exitCallback) {
          exitCallback();
        }
      }
    });
    exitHook(callback => {
      kill().then(callback);
    });
    return p;
  }

  run.setExitCallback = cb => {
    exitCallback = cb;
  };

  return run;
};
