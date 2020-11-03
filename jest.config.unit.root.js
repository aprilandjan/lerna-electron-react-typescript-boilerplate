//  e2e test config for the monorepo root
const name = require('./package.json').name;

module.exports = {
  displayName: `${name} unit`,
  testPathIgnorePatterns: ['/node_modules/', '/packages/', '/test/e2e/'],
};
