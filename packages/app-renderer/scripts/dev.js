//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { spawnSync } = require('child_process');
const WebpackDevServer = require('webpack-dev-server');
const createWebpackCompiler = require('./utils/createWebpackCompiler');
const clearConsole = require('./utils/clearConsole');
const webpackConfig = require('../webpack.config.dev');

// FIXME: extract env variables
const port = process.env.PORT || 1212;
const host = process.env.HOST || 'localhost';
// const publicPath = `http://localhost:${port}/dist`;
const publicPath = path.join(__dirname, '../public');
const dllPath = path.join(__dirname, '../dll');
const manifest = path.resolve(dllPath, 'renderer.json');
const manifestReady = fs.existsSync(manifest);
if (!manifestReady) {
  console.log(
    chalk.black.bgYellow.bold(
      'The DLL files are missing. Sit back while we build them for you',
    )
  );
  spawnSync('node', [
    path.join(__dirname, './dev-dll.js'),
  ], {
    env: {
      ...process.env,
      KEEP_CONSOLE: true,
    },
    stdio: 'inherit',
  });
}


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
  onCompiled: (first) => {
    if (first) {
      // console.log('first compiled');
      ready = true;
      if (process.send) {
        process.send('ready');
      }
    }
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
