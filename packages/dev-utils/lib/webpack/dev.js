//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const webpackConfig = require('./webpack.config.node');
const webpackDev = require('../utils/webpackDev');
const ipc = require('../utils/ipc');

webpackDev(webpackConfig, null, () => {
  ipc.initClient(() => {
    ipc.sendToServer('ready');
  });
});
