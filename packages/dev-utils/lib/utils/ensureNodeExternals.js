const path = require('path');
const nodeExternals = require('webpack-node-externals');
const findLernaPackages = require('find-lerna-packages');

module.exports = function ensureExternals() {
  const pkgList = findLernaPackages.sync();
  const pkgNames = pkgList.map(pkg => pkg.name);
  const rootModuleDir = path.join(pkgList[0].rootPath, 'node_modules');
  const additional = ['electron', 'webpack', 'electron-devtools-installer'];
  return [
    nodeExternals({
      additionalModuleDirs: [rootModuleDir],
      ...pkgNames,
      ...additional,
    }),
  ];
};
