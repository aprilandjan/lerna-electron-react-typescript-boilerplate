//  ensure env
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

const paths = require('../utils/paths');
const getElectronRunner = require('../utils/getElectronRunner');

getElectronRunner({
  //  入口文件
  entry: paths.appMainProd,
  //  electron 运行的参数
  args: [],
})();
