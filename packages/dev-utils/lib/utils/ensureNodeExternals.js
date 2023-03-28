const nodeExternals = require('webpack-node-externals');

module.exports = function ensureExternals() {
  return [
    nodeExternals({
      modulesFromFile: true,
      excludeFromBundle: ['dependencies', 'devDependencies'],
    }),
  ];
};
