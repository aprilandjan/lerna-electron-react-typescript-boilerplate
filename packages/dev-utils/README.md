# dev-utils

对 electron 主进程、渲染进程模块进行 babel/ts/webpack 打包编译的工具库。

## 可执行程序

模块提供以下命令供其他子模块调用

### `app-main`

主进程运行程序，提供：

- `app-main dev`: 开发运行
- `app-main build`: 构建生产环境包
- `app-main start`: 以 build 出来的主进程 js 运行 electron 程序

### `app-renderer`

- `app-renderer dev`: 开发运行
- `app-renderer build`: 构建打包

### `app-module`

- `app-module dev`: 开发运行
- `app-module build`: 构建打包

### `app-bundle`

A wrapper for `electron-builder` CLI, which will try to read `electron-builder` field from the `package.json` file of each local monorepo packages, and then merge the `files` field altogether, for self-management purpose.

- `app-bundle --mac`: build for package
- `app-bundle --win`: build win package

## 环境变量配置

### `HOST`

渲染进程 dev server 的 host。默认为 `localhost`

### `PORT`

渲染进程 dev server 的 port。默认为 `1212`

### `CLEAR_CONSOLE`

是否在 dev 时按 webpack 的信息需要自动刷掉输出。默认 `false`

### `OPEN_ANALYZER`

在运行时启动 `WebpackBundleAnalyzer` 输出打包分析报告。默认为 `false`

### `REBUILD_DLL`

在运行 `app-renderer dev` 时强制重新构建 webpack DLL。默认为 `false`

### `DISABLE_TS_CHECK`

关掉 webpack 编译时的 `typescript` 类型检查。默认为 `false`

### `COMPILE_ON_TS_ERROR`

TS 报错时依然编译。默认为 `false`

### `ELECTRON_AUTO_RELOAD`

开发环境下 Electron 进程是否在 webpack 编译后自动重启。也可以通过输入 `R` + `Enter` 随时手动重启。默认 `false`
