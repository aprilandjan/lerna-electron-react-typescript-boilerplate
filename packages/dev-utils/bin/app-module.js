#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

const run = require('../lib/utils/run');
const moduleFunc = require('../lib/module');

run({
  dev: () => moduleFunc('dev'),
  clean: () => moduleFunc('clean'),
  build: () => moduleFunc('build'),
});
