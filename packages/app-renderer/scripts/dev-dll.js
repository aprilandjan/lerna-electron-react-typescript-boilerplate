//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const createWebpackCompiler = require('./utils/createWebpackCompiler');
const webpackConfig = require('../webpack.config.dev.dll');

const compiler = createWebpackCompiler({
  config: webpackConfig,
  useTypeScript: false,
  tscCompileOnError: true,
});

compiler.run();
