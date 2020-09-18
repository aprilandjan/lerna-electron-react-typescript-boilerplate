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
    // find last of arg
    const t = chalk.gray(`+${diff}ms`);
    const lastArg = args.pop();
    let p = env.disableConsoleTime ? '' : `[${chalk.green(new Date().toISOString())}]` + prefix;

    return console.log(p, ...args, lastArg.trimRight(), t);
  },
};
