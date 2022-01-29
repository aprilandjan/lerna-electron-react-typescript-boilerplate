const exitHook = require('async-exit-hook');
const createWebpackCompiler = require('../utils/createWebpackCompiler');

/** 启用 webpack watch dev */
module.exports = (webpackConfig, onCompiled, onFirstCompiledSuccess) => {
  const compiler = createWebpackCompiler({
    config: webpackConfig,
    onCompiled,
    onFirstCompiledSuccess,
  });

  const watching = compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    () => {}
  );

  exitHook(() => {
    watching.close();
  });

  return watching;
};
