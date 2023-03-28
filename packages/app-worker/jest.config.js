const name = require('./package.json').name;

module.exports = {
  displayName: name,
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/*.(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
};
