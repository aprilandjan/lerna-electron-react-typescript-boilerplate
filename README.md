# Lerna-React-TypeScript-Electron App

A Lerna-React-TypeScript-Electron App Boilerplate project.

## AIM

- [x] remove `flow`
- [x] use `lerna`
- [x] add electron icon, see <https://www.electron.build/icons>
- [x] ensure `dev` & `build` progress
- [x] add renderer compile time progress
- [] automatically dll compare & rebuild
- [x] check dll running speed
- [x] app main watch & reload: reload: use webpack, listen its compile status
- [x] main process ask for restart if needed
- [] main process modules partly hot-reload
- [] main & renderer communicate through node ipc
- [x] extract webpack things into dev-utils
- [x] customizable build step
- [x] whole project building process
- [x] fix main bundle build warning
- [x] pack electron app
- [x] add `typescript`
- [x] allow `typescript` path alias
- [x] allow mixed `js(x)` and `ts(x)`
- [x] encapsuled eslint config
- [x] encapsuled babel config
- [x] style class name generation
- [x] tsconfig include only src(or exclude `node_modules`) to speed up typechecking
- [x] user customized webpack config merging
- [x] renderer webpack externals be default set as the main package's dependencies
- [] all scripts in `typescript`
- [] support unittest & e2e test
- [] app auto-update
- [x] attach debugger for main process in vscode
- [] attach chrome debugger for main process in vscode
- [] separated eslint rules for node scripts and browser scripts
- [] add eslint in webpack compile check
- [x] allow skip typechecking in webpack compiler
- [] webpack resolve and build lerna modules
- [x] electron builder(asar) packing
- [x] support `require.context` with webpack alias path

### Debug Main Process

`vscode` debugger supports only `inline-source-map`. In order to debug main process in vscode debugger, we should:

- change webpack devtool into `inline-source-map`
- use `sourceMapPathOverrides` in `launch.json` to correctly map webpack resources into actual resource url
- alternatively, use webpack [devtoolModuleFilenameTemplate](https://webpack.js.org/configuration/output/#outputdevtoolmodulefilenametemplate) to change generated sourcemap data url

## References

- <https://github.com/electron-react-boilerplate/electron-react-boilerplate>
- <https://github.com/electron-react-boilerplate/examples/tree/master/examples/typescript>
- <https://github.com/amaurymartiny/cra-lerna-electron>
- <https://webpack.js.org/configuration/devtool/>
- <https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_source-maps>
