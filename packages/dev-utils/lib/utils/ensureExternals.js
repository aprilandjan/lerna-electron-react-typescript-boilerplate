module.exports = function ensureExternals (list) {
  const externals = list.filter(item => !item.startsWith('@types/'));
  externals.push("electron")
  externals.push("webpack")
  // because electron-devtools-installer specified in the devDependencies, but required in the index.dev
  externals.push("electron-devtools-installer");
  return externals;
}
