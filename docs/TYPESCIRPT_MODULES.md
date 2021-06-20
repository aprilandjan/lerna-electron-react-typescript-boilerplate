# Typescript Modules

Some isolated functions can be extracted to independent modules. These modules are just like ones from `node_modules`, except that all source codes are maintained locally. And these modules can be written completely in typescript, to provide maintainability. For example:

```bash
packages
├── module-a    # individual module a
├── module-b    # individual module b
└── module-c    # individual module c, which depends on module-a and module b
```

The `module-a` and `module-b` is some individual functionalities, the `module-c` depends on them. When we developing `module-c`, the `module-a` and `module-b` must be already compiled, otherwise the typescript will complaint that it cannot find the `module-a` `module-b` entries. Image if we have more complex typescript modules, they might have more complex dependent relations, the building could be trouble because of that.

Luckily we have [typescript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) to handle that. It provides composite compilations against configured project references. Take `module-c` for example, we need:

1. add `module-a` and `module-b` to its dependency list in `package.json`. `Lerna` will link these local modules together later.
2. add `tsconfig` for the `module-c` as following:

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["./src"],
  "compilerOptions": {
    "module": "commonjs",
    "composite": true, // toggle on project reference
    "noEmit": false,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "module-a": ["../../packages/module-a/src"], //  path alias to make IDE `go to definition` always jump to source codes rather than compiled dist
      "module-b": ["../../packages/module-b/src"] // same as above
    }
  },
  "references": [
    //  define where references dependent project locates
    {
      "path": "../../packages/module-a"
    },
    {
      "path": "../../packages/module-b"
    }
  ]
}
```

3. The modules which is being referenced(`module-a` `module-b` in this example), must also be set to support the composite compilation. Just edit their `tsconfig` and set `compilerOptions.composite` to `true`.

4. Use `tsc -b` to do compilation things, such as `--clean`, `--watch`, etc.

After doing above, we can freely compile any modules, without worrying about the dependent modules.

## TODO

- [x] eslint will recognize typescript modules that didn't built
- [x] `Go to definition` jumps to the source codes rather than declarations
- [x] when dev webpack modules, do not compile these typescript modules at all
- [x] when build webpack modules, do not compile these typescript modules at all
- [x] when build typescript modules, dependent typescript modules will be build altogether, topologically, from module root
- [x] when build typescript modules, dependent typescript modules will be build altogether, topologically, from project root
- [ ] extract all these ts config files and commands into centralized utility kits
  - [ ] `app-module clean`
  - [ ] `app-module dev-watch`
  - [ ] `app-module build`

## References

- <https://www.typescriptlang.org/docs/handbook/project-references.html>
- <https://github.com/RyanCavanaugh/project-references-demo>
- <https://github.com/NiGhTTraX/ts-monorepo/tree/project-references>
- <https://medium.com/@NiGhTTraX/how-to-set-up-a-typescript-monorepo-with-lerna-c6acda7d4559>
