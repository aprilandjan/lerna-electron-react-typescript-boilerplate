#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const run = require('../lib/utils/run');

run({
  dev: path.join(__dirname, '../lib/pack/dev.js'),
  build: path.join(__dirname, '../lib/pack/build.js'),
});
