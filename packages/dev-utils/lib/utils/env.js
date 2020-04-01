const fs = require('fs-extra');
const paths = require('./paths');
// const logger = require('./logger');
const pkg = require(paths.appPackageJson);

const NODE_ENV = process.env.NODE_ENV;

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `.env.local`,
  `.env`,
].filter(Boolean);
// logger.debug('available env files:', dotenvFiles);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    // logger.debug('load env file:', dotenvFile);
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});

/** 获取需要注入到打包的代码里的环境变量 */
function getInjectedEnv() {
  const injectedPrefix = /^CLIENT_/i;
  const raw = Object.keys(process.env)
    .filter(key => injectedPrefix.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // TODO: 同时注入一些其他的环境变量
        NODE_ENV: process.env.NODE_ENV || 'development',
        // APP_NAME: process.env.APP_NAME || pkg.name,
        // APP_VERSION: process.env.APP_VERSION || pkg.version,
      }
    );
  return raw;
}

module.exports = {
  getInjectedEnv,
  /** 当前开发调试的目标 */
  target: process.env.DEV_UTILS_TARGET || pkg.name,
  /** 渲染进程 dev server 的 host */
  host: process.env.HOST || 'localhost',
  /** 渲染进程 dev server 的 port */
  port: process.env.PORT || '1212',
  /** 是否在 dev 时按 webpack 的信息需要自动刷掉输出 */
  clearConsole: process.env.CLEAR_CONSOLE || false,
  /** 是否要在 vsc 里调试主进程程序 */
  debugElectronInVSC: process.env.DEBUG_ELECTRON_IN_VSC || true,
  /** 是否要打开 webpack bundle analyzer */
  openAnalyzer: process.env.OPEN_ANALYZER || false,
  /** 在运行 `app-renderer dev` 时重新构建 webpack DLL */
  rebuildDLL: process.env.REBUILD_DLL || false,
  /** 关掉 webpack 编译时的 `typescript` 类型检查 */
  disableTsCheck: process.env.DISABLE_TS_CHECK || false,
  /** TS 报错时依然编译 */
  compileOnTsError: process.env.COMPILE_ON_TS_ERROR || false,
  /** 是否删除未被 webpack 编译的文件 */
  deleteUnused: process.env.DELETE_UNUSED || false,
  /** 主进程是否编译后自动重载 */
  electronAutoReload: process.env.ELECTRON_AUTO_RELOAD || true,
  /** 是否注入 COV_REPORT 的代码 */
  injectCovReport: process.env.INJECT_COV_REPORT || false,
};
