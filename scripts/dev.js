// const fs = require('fs');
const path = require('path');
const { fork, spawn } = require('child_process');

const renderer = path.join(__dirname, '../packages/app-renderer/scripts/dev.js');
const cp = fork(renderer, [
  //  args here
]);

cp.on('message', () => {
  console.log('app-renderer ready, start app-main...');
  spawn('yarn', ['dev'], {
    cwd: path.join(__dirname, '../packages/app-main'),
    stdio: 'inherit',
  });
});
