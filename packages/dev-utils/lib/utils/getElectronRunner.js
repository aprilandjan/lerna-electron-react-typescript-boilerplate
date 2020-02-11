// const path = require('path');
const { spawn } = require('child_process');
const paths = require('./paths');
const logger = require('./logger');

module.exports = function getElectronRunner(config = {}) {
  const { autoReload, entry, args = [] } = config;

  let electronProcess = null;
  let compileHash = null;
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
  async function run(hash) {
    if (compileHash === hash) {
      logger.debug('do not run electron because of same hash', hash);
      return;
    }
    if (electronProcess) {
      if (autoReload) {
        logger.debug('auto reload electron process...');
        autoKilled = true;
        await kill();
        electronProcess = startElectron();
        compileHash = hash;
      } else {
        logger.debug('wait for user reload key-control');
      }
    } else {
      electronProcess = startElectron();
      compileHash = hash;
    }
  }

  function startElectron() {
    logger.debug('spawn new electron process');
    autoKilled = false;
    //  eslint-disable-next-line
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
    return p;
  }

  return run;
};
