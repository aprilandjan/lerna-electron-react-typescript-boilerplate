const tsc = require('../utils/tsc');

const commands = {
  clean: ['-b', '--clean'],
  dev: ['-b', '--watch'],
  build: ['-b'],
};

module.exports = cmd => {
  const args = commands[cmd];
  if (!args) {
    throw new Error('module command must be `dev` `build` or `clean`');
  }
  return tsc(args);
};
