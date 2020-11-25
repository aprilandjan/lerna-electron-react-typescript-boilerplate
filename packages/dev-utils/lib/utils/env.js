const fs = require('fs-extra');
const path = require('path');
const paths = require('./paths');
const getLernaRootPath = require('./getLernaRootPath');
// IMPORTANT: this file should not call `logger` because it depends on env, thus make env order not working
// const logger = require('./logger');
const pkg = require(paths.appPackageJson);

const cwd = process.cwd();
const lernaRootPath = getLernaRootPath();

const NODE_ENV = process.env.NODE_ENV;

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvPatterns = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `.env.local`,
  `.env`,
].filter(Boolean);

//  load these
const dotenvFiles = [
  cwd, // load env from cwd prior
  lernaRootPath, //  also load env from lerna root path
].reduce((files, dir) => {
  dotenvPatterns.forEach(p => {
    const fullPath = path.join(dir, p);
    if (!files.includes(fullPath) && fs.existsSync(fullPath)) {
      files.push(fullPath);
    }
  });
  return files;
}, []);

//  load these env files
dotenvFiles.forEach(dotenvFile => {
  require('dotenv-expand')(
    require('dotenv').config({
      path: dotenvFile,
    })
  );
});

/** 获取需要注入到打包的代码里的环境变量 */
function getInjectedEnv() {
  const injectedPrefix = /^CLIENT_/i;
  return Object.keys(process.env)
    .filter(key => injectedPrefix.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // TODO: 同时注入一些其他的环境变量
        NODE_ENV: process.env.NODE_ENV || 'development',
        APP_NAME: process.env.APP_NAME || pkg.name,
        APP_VERSION: process.env.APP_VERSION || pkg.version,
      }
    );
}

/** 获取环境变量的值。如果没定义，则返回默认值 */
function getEnvValue(v, d) {
  if (v === undefined) {
    return d;
  }
  return v;
}

/**
 * 获取 Boolean 类型的环境变量的值。如果没定义，则返回默认值
 * 如果有定义且完全等于 'false'， 则返回 false, 其他都认为是 true
 **/
function getEnvBooleanValue(v, d = false) {
  if (v === undefined) {
    return d;
  }
  return v !== 'false';
}

module.exports = {
  lernaRootPath,
  /** loaded dot env files */
  dotenvFiles,
  getInjectedEnv,
  /** 当前开发调试的目标 */
  target: getEnvValue(process.env.DEV_UTILS_TARGET, pkg.name),
  /** 渲染进程 dev server 的 host */
  host: getEnvValue(process.env.HOST, 'localhost'),
  /** 渲染进程 dev server 的 port */
  port: getEnvValue(process.env.PORT, '1212'),
  /** 是否在 dev 时按 webpack 的信息需要自动刷掉输出 */
  clearConsole: getEnvBooleanValue(process.env.CLEAR_CONSOLE, false),
  /** console 不打印时间 */
  disableConsoleTime: getEnvBooleanValue(process.env.DISABLE_CONSOLE_TIME, false),
  /** 是否要在 vsc 里调试主进程程序 */
  debugElectronInVSC: getEnvBooleanValue(process.env.DEBUG_ELECTRON_IN_VSC, true),
  /** 是否要打开 webpack bundle analyzer */
  openAnalyzer: getEnvBooleanValue(process.env.OPEN_ANALYZER, false),
  /** 在运行 `app-renderer dev` 时重新构建 webpack DLL */
  rebuildDLL: getEnvBooleanValue(process.env.REBUILD_DLL, false),
  /** 关掉 webpack 编译时的 `typescript` 类型检查 */
  disableTsCheck: getEnvBooleanValue(process.env.DISABLE_TS_CHECK, false),
  /** TS 报错时依然编译 */
  compileOnTsError: getEnvBooleanValue(process.env.COMPILE_ON_TS_ERROR, false),
  /** 是否删除未被 webpack 编译的文件 */
  deleteUnused: getEnvBooleanValue(process.env.DELETE_UNUSED, false),
  /** 开发模式下启动 electron 前等待连接的 ipc clients */
  devIpcClients: getEnvValue(process.env.DEV_IPC_CLIENTS, 'app-renderer; app-common'),
  /** 主进程是否编译后自动启动 */
  electronAutoStart: getEnvBooleanValue(process.env.ELECTRON_AUTO_START, true),
  /** 主进程是否编译后自动重载 */
  electronAutoReload: getEnvBooleanValue(process.env.ELECTRON_AUTO_RELOAD, true),
  /** electron 关掉后自动退出开发进程 */
  exitDevWhenElectronQuit: getEnvBooleanValue(process.env.EXIT_DEV_WHEN_ELECTRON_QUIT, false),
  /** electron 打印信息的过滤 */
  grepElectron: getEnvValue(process.env.GREP_ELECTRON, ''),
};
