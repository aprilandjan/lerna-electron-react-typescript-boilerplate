const path = require('path');
const nodeExternals = require('webpack-node-externals');
const findLernaPackages = require('find-lerna-packages');
const env = require('./env');

module.exports = function ensureExternals() {
  const pkgList = findLernaPackages.sync();
  const pkgNames = pkgList.map(pkg => pkg.name);
  /* manually external local modules https://github.com/liady/webpack-node-externals/issues/73 */
  const rootModuleDir = path.join(env.lernaRootPath, 'node_modules');
  const additional = ['electron', 'webpack', 'electron-devtools-installer'];
  return [
    nodeExternals({
      additionalModuleDirs: [rootModuleDir],
      ...pkgNames,
      ...additional,
    }),
  ];
};
