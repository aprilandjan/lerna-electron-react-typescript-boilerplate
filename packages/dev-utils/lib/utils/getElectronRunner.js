// const path = require('path');
const execa = require('execa');
const treeKill = require('tree-kill');
const exitHook = require('async-exit-hook');
const paths = require('./paths');
const logger = require('./logger');
const env = require('./env');
const chalk = require('chalk');

const prefix = `[electron]`;

function log(data, isError = false) {
  const text = data.toString().trimLeft();
  const lines = text
    .split('\n')
    .map(line => line.trimRight())
    .filter(Boolean);

  //  always keep error outputs
  if (isError) {
    lines.forEach(line => {
      logger.info(`${prefix} ${chalk.red(line)}`);
    });
    return;
  }
  //  grep stdout outputs
  if (!env.grepElectron || text.includes(env.grepElectron)) {
    lines.forEach(line => {
      logger.info(`${prefix} ${line}`);
    });
  }
}

module.exports = function getElectronRunner(config = {}) {
  const { entry, args = [] } = config;

  let electronProcess = null;
  let autoKilled = false;
  let exitCallback = null;

  function kill() {
    if (!electronProcess || (electronProcess && electronProcess.killed)) {
      logger.debug('electron process already killed');
      return Promise.resolve();
    }
    logger.debug('kill existed electron process');
    autoKilled = true;
    const pExit = new Promise(resolve => {
      electronProcess.on('exit', () => {
        electronProcess.removeAllListeners();
        logger.debug('electron process exit');
        resolve();
      });
    });
    const pKill = new Promise(resolve => {
      treeKill(electronProcess.pid, () => {
        logger.debug('electron process killed successful');
        resolve();
      });
    });
    return Promise.all([pExit, pKill]);
  }

  exitHook(callback => {
    kill().then(callback);
  });

  function spawnElectron() {
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
    return p;
  }

  /**
   * 启动 Electron. 如果已有 Electron 进程了，则先关掉
   */
  async function start() {
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
    electronProcess = spawnElectron();
  }

  function setExitCallback(cb) {
    exitCallback = cb;
  }

  async function exit() {
    if (electronProcess) {
      logger.debug('exit electron process...');
      autoKilled = true;
      await kill();
    }
    electronProcess = null;
    if (exitCallback) {
      exitCallback();
    }
  }

  return {
    start,
    setExitCallback,
    exit,
  };
};
