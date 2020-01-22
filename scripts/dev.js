// const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function run(packageName, cmd) {
  const cp = spawn('yarn', [cmd], {
    cwd: path.join(__dirname, '../packages', packageName),
    stdio: 'inherit',
  });
  cp.on('exit', () => {
    process.exit(1);
  })
}

run('app-main', 'dev');
run('app-renderer', 'dev');
