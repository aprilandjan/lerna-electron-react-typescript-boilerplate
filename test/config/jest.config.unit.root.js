//  e2e test config for the monorepo root
const base = require('./jest.config.base');
const name = require('../../package.json').name;

module.exports = {
  rootDir: base.rootDir,
  displayName: `${name} unit`,
  testPathIgnorePatterns: ['/node_modules/', '/packages/', '/test/e2e/'],
};
