# Play Electron

A React Electron Project Based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).

## AIM

- Replace `flow` into `typescript`
- Mixed `js(x)` and `ts(x)` files when development
- Maintained with `lerna`

### Remove `flow` types

install [flow-remove-types](https://github.com/facebookarchive/flow-remove-types) and then:

```bash
$ flow-remove-types --pretty --out-dir ./app-no-flow/ ./app/
```

## References

- <https://github.com/electron-react-boilerplate/electron-react-boilerplate>
- <https://github.com/electron-react-boilerplate/examples/tree/master/examples/typescript>
