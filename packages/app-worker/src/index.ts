import os from 'os';

// eslint-disable-next-line
console.log(
  `worker created, os=${os.platform()} pid=${process.pid}, ppid=${process.ppid}, argv=${
    process.argv
  }`
);
process.send!('ready');

let id = Date.now();

setInterval(() => {
  // keep process alive
  if (id > 0) {
    id += 1000;
  }
}, 1000);
