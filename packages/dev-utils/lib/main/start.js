//  ensure env
const NODE_ENV = process.env.NODE_ENV || 'production';
process.env.NODE_ENV = NODE_ENV;
process.env.BABEL_ENV = NODE_ENV;

process.on('unhandledRejection', err => {
  throw err;
});

const paths = require('../utils/paths');
const getElectronRunner = require('../utils/getElectronRunner');

getElectronRunner({
  //  入口文件
  entry: NODE_ENV === 'production' ? paths.appMainProd : paths.appMainDev,
  //  FIXME: electron 运行的参数
  args: [],
})();
