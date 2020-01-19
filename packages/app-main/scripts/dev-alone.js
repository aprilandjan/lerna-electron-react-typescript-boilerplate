//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const debug = require('debug')('app-main');
const path = require('path');
const getElectronRunner = require('./utils/getElectronRunner');
const pollingRenderer = require('./utils/pollingRenderer');

(async () => {
  debug('start polling app-renderer status');
  const result = await pollingRenderer();
  if (!result) {
    debug('app-renderer failed to response')
    return;
  }
  debug('app-renderer ready, start electron');
  const entry = path.join(__dirname, '../src/index');
  const runElectron = getElectronRunner({
    //  入口文件
    entry,
    //  electron 运行的参数
    args: [],
  });

  runElectron();
})();
