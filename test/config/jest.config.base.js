const path = require('path');

// the base jest config
// https://github.com/entria/entria-fullstack/blob/master/jest.config.js
module.exports = {
  rootDir: path.join(__dirname, '../../'),
  // the root matches only its test, not sub packages
  testPathIgnorePatterns: ['/node_modules/', '/release/', '/dist/', '/build/'],
  modulePathIgnorePatterns: ['/release/', '/dist/', '/build/'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**',
    '!**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  // setupFilesAfterEnv: ['./test/setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
};
