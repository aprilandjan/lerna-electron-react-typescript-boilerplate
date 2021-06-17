# Typescript Modules

## TODO

- [x] eslint will recognize typescript modules that didn't built
- [x] `Go to definition` jumps to the source codes rather than declarations
- [ ] when dev webpack modules, do not compile these typescript modules at all
- [x] when build webpack modules, do not compile these typescript modules at all
- [x] when build typescript modules, dependent typescript modules will be build altogether, topologically, from module root
- [ ] when build typescript modules, dependent typescript modules will be build altogether, topologically, from project root
- [ ] extract all these ts config files and commands into centralized utility kits
  - [ ] `app-module clean`
  - [ ] `app-module dev-watch`
  - [ ] `app-module build`

## References

- <https://www.typescriptlang.org/docs/handbook/project-references.html>
- <https://github.com/RyanCavanaugh/project-references-demo>
- <https://github.com/NiGhTTraX/ts-monorepo/tree/project-references>
- <https://medium.com/@NiGhTTraX/how-to-set-up-a-typescript-monorepo-with-lerna-c6acda7d4559>
