const debug = require('debug');
const chalk = require('chalk');
const env = require('./env');

const prefix = `[${chalk.cyan(env.target)}]`;
let last;

function trimLastRight(args) {
  let last = args.pop();
  if (typeof last === 'string') {
    last = last.trimRight();
  }
  return [...args, last];
}

function info(...args) {
  if (args.length === 0) {
    return console.log();
  }
  const now = Date.now();
  const diff = now - (last || now);
  last = now;
  // find last of arg
  const t = chalk.gray(`+${diff}ms`);
  let p =
    (env.disableConsoleTime ? '' : `[${chalk.green(new Date().toLocaleTimeString('en-US'))}]`) +
    prefix;
  return console.log(p, ...trimLastRight(args), t);
}

module.exports = {
  prefix,
  info,
  debug: debug(env.target),
};
