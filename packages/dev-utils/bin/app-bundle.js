#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

const os = require('os');
const p = os.platform();

//  must be mac/win
//  could add more 'electron-builder' cli arguments as followed
//  for example: win --ia32
let args = process.argv.splice(2);
let platform;
if (args.includes('--mac')) {
  platform = 'mac';
} else if (args.includes('--win')) {
  platform = 'win';
} else {
  if (p === 'darwin') {
    platform = 'mac';
  } else if (p === 'win32') {
    platform = 'win';
  }
}
if (!platform) {
  throw new Error('not supported platform ' + p);
}
args = args.filter(arg => !['--mac', '--win'].includes(arg));

require('../lib/bundle/build')(platform, args);
