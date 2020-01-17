//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const createWebpackCompiler = require('./utils/createWebpackCompiler');
const clearConsole = require('./utils/clearConsole');
const webpackConfig = require('../webpack.config.dev');

// FIXME: extract env variables
const port = process.env.PORT || 1212;
const host = process.env.HOST || '0.0.0.0';
// const publicPath = `http://localhost:${port}/dist`;
const publicPath = path.join(__dirname, '../public');
const dllPath = path.join(__dirname, '../dll');

const devServerConfig = {
  port,
  host,
  publicPath: '/',
  // stats: 'errors-only',
  inline: true,
  lazy: false,
  hot: true,
  quiet: true,
  injectClient: false,
  clientLogLevel: 'none',
  compress: true,
  noInfo: true,
  contentBase: [
    publicPath,
    dllPath,
  ],
  watchContentBase: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  watchOptions: {
    // aggregateTimeout: 300,
    ignored: /node_modules/,
  },
  historyApiFallback: {
    // verbose: true,
    disableDotRule: false
  },
  before() {
    // app middlewares
  }
}

let devServer;

const devSocket = {
  warnings: warnings =>
    devServer.sockWrite(devServer.sockets, 'warnings', warnings),
  errors: errors =>
    devServer.sockWrite(devServer.sockets, 'errors', errors),
};

const compiler = createWebpackCompiler({
  config: webpackConfig,
  devSocket,
  useTypeScript: false,
  tscCompileOnError: true,
  onCompiled: () => {
    // console.log('is first compiled?', first);
    // TODO: notify parent process if possible
  }
});
devServer = new WebpackDevServer(compiler, devServerConfig);

// start dev server
devServer.listen(port, host, err => {
  if (err) {
    return console.log(err);
  }
  clearConsole();

  console.log(chalk.cyan('Starting the renderer dev server...\n'));
});

['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    devServer.close();
    process.exit();
  });
});
