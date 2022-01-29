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
const exitHook = require('async-exit-hook');
const WebpackDevServer = require('webpack-dev-server');
const logger = require('../utils/logger');
const paths = require('../utils/paths');
const env = require('../utils/env');
const checkPort = require('../utils/checkPort');
const createWebpackCompiler = require('../utils/createWebpackCompiler');
const clearConsole = require('../utils/clearConsole');
const printError = require('../utils/printError');
const ipc = require('../utils/ipc');
const webpackConfig = require('./webpack.config.dev');
const webpackDllConfig = require('./webpack.config.dev.dll');

function checkBuildDLL() {
  return new Promise((resolve, reject) => {
    if (env.rebuildDLL) {
      //  强制重构 DLL
      logger.info('found env REBUILD_DLL, rebuild dll');
    } else {
      //  检查 DLL 是否存在
      const manifestReady = fs.existsSync(paths.appDLLManifest);
      if (manifestReady) {
        logger.debug('dll manifest found. skip build dll');
        resolve();
        return;
      }
      logger.info(chalk.yellow('The DLL files are missing. Start building dll...'));
    }
    const compiler = createWebpackCompiler({
      config: webpackDllConfig,
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        logger.info(
          chalk.yellow(`DLL built successfully in ${stats.endTime - stats.startTime} ms!`)
        );
        resolve(stats);
      }
    });
  });
}

checkPort(env.port, env.host)
  .then(() => {
    return checkBuildDLL();
  })
  .then(() => {
    //  start dev server
    let devServer;

    const devServerConfig = {
      port: env.port,
      host: env.host,
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
      contentBase: [paths.appPublic, paths.appDLL],
      watchContentBase: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      watchOptions: {
        // aggregateTimeout: 300,
        ignored: /node_modules/,
      },
      historyApiFallback: {
        // verbose: true,
        disableDotRule: false,
      },
    };

    const compiler = createWebpackCompiler({
      config: webpackConfig,
      onFirstCompiledSuccess: () => {
        logger.debug('first compiled');
        ipc.initClient(() => {
          ipc.sendToServer('ready');
        });
      },
    });
    devServer = new WebpackDevServer(compiler, devServerConfig);

    // start dev server
    devServer.listen(env.port, env.host, err => {
      if (err) {
        return logger.info(err);
      }
      clearConsole();

      logger.info(chalk.cyan('Starting dev server...\n'));
    });

    exitHook(() => {
      devServer.close();
    });
  })
  .catch(err => {
    printError(err);
    process.exit(1);
  });
