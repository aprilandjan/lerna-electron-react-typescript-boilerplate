const findLernaPackages = require('find-lerna-packages');

const packages = findLernaPackages.sync();

module.exports = function resolvePackage(name) {
  return packages.find(p => p.name === name);
};
