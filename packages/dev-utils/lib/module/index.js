const execa = require('execa');
const path = require('path');
const env = require('../utils/env');

const commands = {
  clean: '--clean',
  dev: '--watch',
  build: '',
};

module.exports = cmd => {
  return execa('tsc', ['-b', path.join(env.lernaRootPath, 'tsconfig.json'), ...commands[cmd]], {
    execPath: env.lernaRootPath,
    localDir: env.lernaRootPath,
    preferLocal: true,
    stdin: 'inherit',
  });
};
