const debug = require('debug');
const chalk = require('chalk');
const env = require('./env');

const prefix = `[${chalk.cyan(env.target)}]`;

module.exports = {
  prefix,
  debug: debug(env.target),
  info: (...args) => {
    if (args.length === 0) {
      return console.log();
    }
    return console.log(prefix, ...args);
  },
};
