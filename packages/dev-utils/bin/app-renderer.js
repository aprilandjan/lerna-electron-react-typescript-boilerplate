#!/usr/bin/env node

// process.env.BABEL_CONFIG_REACT = true;
process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const run = require('../lib/utils/run');

run({
  dev: path.join(__dirname, '../lib/renderer/dev.js'),
  build: path.join(__dirname, '../lib/renderer/build.js'),
});
