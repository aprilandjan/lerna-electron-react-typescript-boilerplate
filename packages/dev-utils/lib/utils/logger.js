const debug = require('debug');
const chalk = require('chalk');

const devTarget = process.env.APP_DEV_TARGET || 'dev-utils';

module.exports = {
  debug: debug(devTarget),
  info: (...args) => {
    if (args.length === 0) {
      return console.log();
    }
    return console.log(`[${chalk.cyan(devTarget)}]`, ...args);
  },
};
