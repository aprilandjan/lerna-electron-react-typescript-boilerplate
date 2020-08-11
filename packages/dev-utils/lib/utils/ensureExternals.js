// https://webpack.js.org/configuration/externals/
function checkExternals(context, request, callback) {
  // TODO: external node_module things
  callback();
}

module.exports = function ensureExternals() {
  return [checkExternals, 'electron', 'webpack', 'electron-devtools-installer'];
};
