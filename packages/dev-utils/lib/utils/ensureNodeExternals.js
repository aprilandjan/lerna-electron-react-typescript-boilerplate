const path = require('path');
const nodeExternals = require('webpack-node-externals');
const findLernaPackages = require('find-lerna-packages');
const env = require('./env');

module.exports = function ensureExternals() {
  const pkgList = findLernaPackages.sync();
  const pkgNames = pkgList.map(pkg => pkg.name);
  const rootModuleDir = path.join(env.lernaRootPath, 'node_modules');
  const additional = ['electron', 'webpack', 'electron-devtools-installer'];
  console.log('ignored', ...pkgNames);
  return [
    nodeExternals({
      additionalModuleDirs: [rootModuleDir],
      ...pkgNames,
      ...additional,
    }),
  ];
};
