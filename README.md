# Lerna React Electron App in TypeScript

A Lerna React Electron App Boilerplate project in TypeScript.

## AIM

- [x] remove `flow`
- [x] use `lerna`
- [x] add electron icon, see <https://www.electron.build/icons>
- [x] ensure `dev` & `build` progress
- [x] add renderer compile time progress
- [] automatically dll compare & rebuild
- [x] app main watch & reload: reload: use webpack, listen its compile status
- [] main process ask for restart if needed
- [] main process modules partly hot-reload
- [] main & renderer communicate through node ipc
- [x] extract webpack things into dev-utils
- [x] customizable build step
- [x] whole project building process
- [] fix main bundle build warning
- [x] pack electron app
- [x] add `typescript`
- [x] allow `typescript` path alias
- [x] allow mixed `js(x)` and `ts(x)`
- [x] encapsuled eslint config
- [x] encapsuled babel config
- [x] style class name generation
- [] all scripts in `typescript`
- [] support unittest & e2e test
- [] app auto-update
- [] attach debugger in main process

### Remove `flow` types

install [flow-remove-types](https://github.com/facebookarchive/flow-remove-types) and then:

```bash
$ flow-remove-types --pretty --out-dir ./app-no-flow/ ./app/
```

## References

- <https://github.com/electron-react-boilerplate/electron-react-boilerplate>
- <https://github.com/electron-react-boilerplate/examples/tree/master/examples/typescript>
- <https://github.com/amaurymartiny/cra-lerna-electron>
