const path = require('path');

module.exports = function resolvePackage(name) {
  return path.join(__dirname, '../../packages', name);
};
