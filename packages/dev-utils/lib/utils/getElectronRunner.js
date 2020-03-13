// const path = require('path');
const spawn = require('cross-spawn');
const exitHook = require('async-exit-hook');
const paths = require('./paths');
const logger = require('./logger');

module.exports = function getElectronRunner(config = {}) {
  const { entry, args = [] } = config;

  let electronProcess = null;
  let autoKilled = false;

  function kill(signal) {
    logger.debug('kill existed electron process');
    autoKilled = true;
    return new Promise(resolve => {
      electronProcess.on('close', resolve);
      electronProcess.kill(signal);
    });
  }

  /**
   * 启动 Electron. 如果已有 Electron 进程了，则先关掉
   */
  async function run() {
    if (electronProcess) {
      logger.debug('reload electron process...');
      autoKilled = true;
      await kill('SIGINT');
      electronProcess = startElectron();
    } else {
      electronProcess = startElectron();
    }
  }

  function startElectron() {
    logger.debug('spawn new electron process');
    autoKilled = false;
    const electronRuntime = require('electron').toString();
    const p = spawn(electronRuntime, [entry, '--inspect', ...args], {
      cwd: paths.appPath,
    });

    p.stdout.on('data', data => {
      data = data.toString();
      if (data.trim() !== '') {
        logger.info(`[electron] ${data}`);
      }
    });
    p.stderr.on('error', data => {
      data = data.toString();
      if (data.trim() !== '') {
        logger.info(`[electron] ${data}`);
      }
    });

    p.on('close', (code, signal) => {
      logger.debug(`electron process closed with exit code ${code} and signal ${signal}`);
      if (!autoKilled) {
        logger.debug('exit current process');
        process.exit(1);
      }
    });
    exitHook(callback => {
      kill('SIGINT').then(callback);
    });
    return p;
  }

  return run;
};
