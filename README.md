# Play Electron

A React Electron Project Based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).

## AIM

- [x] remove `flow`
- [x] use `lerna`
- [] add `typescript`
- [] allow mixed `js(x)` and `ts(x)`

### Remove `flow` types

install [flow-remove-types](https://github.com/facebookarchive/flow-remove-types) and then:

```bash
$ flow-remove-types --pretty --out-dir ./app-no-flow/ ./app/
```

## TODO:

- add electron icon
- ensure `dev` & `build` progress

## References

- <https://github.com/electron-react-boilerplate/electron-react-boilerplate>
- <https://github.com/electron-react-boilerplate/examples/tree/master/examples/typescript>
- <https://github.com/amaurymartiny/cra-lerna-electron>
