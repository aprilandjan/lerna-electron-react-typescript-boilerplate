// complete jest config for running both unit & e2e tests
const base = require('./jest.config.base');

module.exports = {
  ...base,
  projects: [
    '<rootDir>/jest.config.e2e.js',
    '<rootDir>/jest.config.unit.root.js',
    '<rootDir>/packages/*/jest.config.js',
  ],
};
