//  e2e test config for the monorepo root
const base = require('./jest.config.base');
const name = require('../../package.json').name;

module.exports = {
  ...base,
  displayName: `${name} e2e`,
  testPathIgnorePatterns: ['/node_modules/', '/packages/', '/test/unit/'],
};
