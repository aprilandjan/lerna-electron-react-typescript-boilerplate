const debug = require('debug');
const chalk = require('chalk');
const env = require('./env');

const prefix = `[${chalk.cyan(env.target)}]`;
let last;

module.exports = {
  prefix,
  debug: debug(env.target),
  info: (...args) => {
    if (args.length === 0) {
      return console.log();
    }
    const now = Date.now();
    const diff = now - (last || now);
    last = now;
    return console.log(prefix, chalk.gray(`+${diff}ms`), ...args);
  },
};
