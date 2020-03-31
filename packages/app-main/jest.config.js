const name = require('./package.json').name;

module.exports = {
  displayName: name,
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
};
