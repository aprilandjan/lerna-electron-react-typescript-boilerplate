//  unittest config for the whole project, include monorepo root and its sub packages
const base = require('./jest.config.base');

module.exports = {
  ...base,
  projects: [
    '<rootDir>/test/config/jest.config.unit.root.js',
    '<rootDir>/packages/*/jest.config.js',
  ],
};
