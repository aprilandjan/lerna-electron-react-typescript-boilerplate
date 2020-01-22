//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
// const path = require('path');
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const logger = require('../utils/logger');
const paths = require('../utils/paths');
const createWebpackCompiler = require('../utils/createWebpackCompiler');
const clearConsole = require('../utils/clearConsole');
const webpackConfig = require('./webpack.config.dev');
const webpackDllConfig = require('./webpack.config.dev.dll');

// FIXME: extract env variables
const port = process.env.PORT || 1212;
const host = process.env.HOST || 'localhost';

function checkBuildDLL() {
  return new Promise((resolve, reject) => {
    const manifestReady = fs.existsSync(paths.appDLLManifest);
    if (manifestReady) {
      logger.debug('dll manifest found. skip build dll');
      resolve();
      return;
    }
    logger.info(
      chalk.yellow(
        'The DLL files are missing. Start building dll...',
      )
    );
    const compiler = createWebpackCompiler({
      config: webpackDllConfig,
      useTypeScript: false,
      tscCompileOnError: true,
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        logger.info(
          chalk.yellow(`DLL built successfully in ${stats.endTime - stats.startTime} ms!`)
        )
        resolve(stats);
      }
    });
  });
}

checkBuildDLL().then(() => {
  //  start dev server
  let devServer;
  let ready = false;

  const devServerConfig = {
    port,
    host,
    // https://github.com/webpack/webpack-dev-server/issues/1385
    // publicPath: '/',
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
      paths.appPublic,
      paths.appDLL,
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
    before(app) {
      // app middleware
      app.get('/dev-server-status', (req, res) => {
        res.send(ready ? 'ready' : 'pending');
      });
    }
  }

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
    onFirstCompiledSuccess: () => {
      logger.debug('first compiled');
      ready = true;
      if (process.send) {
        process.send('ready');
      }
    }
  });
  devServer = new WebpackDevServer(compiler, devServerConfig);

  // start dev server
  devServer.listen(port, host, err => {
    if (err) {
      return logger.info(err);
    }
    clearConsole();

    logger.info(chalk.cyan('Starting the renderer dev server...\n'));
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      devServer.close();
      process.exit();
    });
  });
}).catch(() => {
  process.exit(1);
})
