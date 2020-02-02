#!/usr/bin/env node
process.env.APP_DEV_TARGET = 'app-main';

process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const run = require('../lib/utils/run');

run({
  dev: path.join(__dirname, '../lib/main/dev.js'),
  build: path.join(__dirname, '../lib/main/build.js'),
  start: path.join(__dirname, '../lib/main/start.js'),
});
