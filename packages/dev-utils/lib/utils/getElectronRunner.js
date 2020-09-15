// const path = require('path');
// const spawn = require('cross-spawn');
const execa = require('execa');
const exitHook = require('async-exit-hook');
const paths = require('./paths');
const logger = require('./logger');
const env = require('./env');
const chalk = require('chalk');

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

  function log(data, isError = false) {
    const lines = data.toString().split('\n');

    lines.forEach(line => {
      let text = line.trim();
      if (text === '') {
        return;
      }
      if (isError) {
        text = chalk.red(text);
      }
      if (!env.grepElectron || text.includes(env.grepElectron)) {
        logger.info(`[electron] ${text}`);
      }
    });
  }

  function startElectron() {
    logger.debug('spawn new electron process');
    autoKilled = false;
    const electronRuntime = require('electron').toString();
    const p = execa(electronRuntime, [entry, '--inspect', ...args], {
      cwd: paths.appPath,
    });

    p.stdout.on('data', data => {
      log(data);
    });
    p.stderr.on('data', data => {
      log(data, true);
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
