const name = require('./package.json').name;

module.exports = {
  displayName: name,
  // this will override same-name field in root jest config
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['../../scripts/testing/setup.js'],
};
