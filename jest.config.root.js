const name = require('./package.json').name;

module.exports = {
  displayName: name,
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/packages/'],
};
