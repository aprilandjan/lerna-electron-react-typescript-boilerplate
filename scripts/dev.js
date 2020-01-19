// const fs = require('fs');
const path = require('path');
const { fork, spawn } = require('child_process');

const renderer = path.join(__dirname, '../packages/app-renderer/scripts/dev.js');
const rendererProcess = fork(renderer, [
  //  args here
]);

rendererProcess.on('message', () => {
  console.log('app-renderer ready, start app-main...');
  const mainProcess = spawn('yarn', ['dev'], {
    cwd: path.join(__dirname, '../packages/app-main'),
    stdio: 'inherit',
  });
  mainProcess.on('exit', () => {
    process.exit(1);
  })
});

rendererProcess.on('exit', () => {
  process.exit(1);
});
