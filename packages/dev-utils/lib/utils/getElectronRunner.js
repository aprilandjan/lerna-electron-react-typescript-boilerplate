// const path = require('path');
const spawn = require('cross-spawn');
// const execa = require('execa');
const exitHook = require('async-exit-hook');
const paths = require('./paths');
const logger = require('./logger');
const env = require('./env');

module.exports = function getElectronRunner(config = {}) {
  const { entry, args = [] } = config;

  let electronProcess = null;
  let autoKilled = false;

  function kill() {
    logger.debug('kill existed electron process');
    autoKilled = true;
    return new Promise(resolve => {
      electronProcess.on('close', resolve);
      electronProcess.kill();
    });
  }

  /**
   * 启动 Electron. 如果已有 Electron 进程了，则先关掉
   */
  async function run() {
    if (electronProcess) {
      logger.debug('reload electron process...');
      autoKilled = true;
      await kill();
    }
    electronProcess = startElectron();
  }

  function log(data) {
    data = data.toString();
    if (data.trim() === '') {
      return;
    }
    if (!env.grepElectron || data.includes(env.grepElectron)) {
      logger.info(`[electron] ${data}`);
    }
  }

  function startElectron() {
    logger.debug('spawn new electron process');
    autoKilled = false;
    const electronRuntime = require('electron').toString();
    // FIXME: use execa to ensure kill works?
    const p = spawn(electronRuntime, [entry, '--inspect', ...args], {
      cwd: paths.appPath,
    });

    p.stdout.on('data', data => {
      log(data);
    });
    p.stderr.on('data', data => {
      log(data);
    });

    p.on('close', (code, signal) => {
      logger.debug(`electron process closed with exit code ${code} and signal ${signal}`);
      if (!autoKilled) {
        logger.debug('exit current process');
        process.exit(1);
      }
    });
    exitHook(callback => {
      kill().then(callback);
    });
    return p;
  }

  return run;
};
