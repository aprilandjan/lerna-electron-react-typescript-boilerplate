//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const baseConfig = require('../webpack.config.base');
const webpackDev = require('../utils/webpackDev');

webpackDev(baseConfig);
