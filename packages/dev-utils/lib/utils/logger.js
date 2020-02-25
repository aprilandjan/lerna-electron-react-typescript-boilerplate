const debug = require('debug');
const chalk = require('chalk');
const env = require('./env');

module.exports = {
  debug: debug(env.target),
  info: (...args) => {
    if (args.length === 0) {
      return console.log();
    }
    return console.log(`[${chalk.cyan(env.target)}]`, ...args);
  },
};
