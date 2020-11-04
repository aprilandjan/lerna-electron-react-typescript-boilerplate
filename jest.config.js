// complete jest config for running both unit & e2e tests
const base = require('./test/config/jest.config.base');

module.exports = {
  ...base,
  projects: [
    '<rootDir>/test/config/jest.config.e2e.js',
    '<rootDir>/test/config/jest.config.unit.root.js',
    '<rootDir>/packages/*/jest.config.js',
  ],
};
