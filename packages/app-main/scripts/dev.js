//  ensure env
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

//  catch all uncaught exceptions
process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function isRendererReady() {
  return new Promise((resolve) => {
    http.get('http://localhost:1212/dev-server-status', (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      })
      res.on('end', () => {
        if (data === 'ready') {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    }).on('error', () => {
      resolve(false);
    })
  })
}

async function delay(t) {
  return new Promise(resolve => setTimeout(resolve, t));
}

async function pollingRenderer(interval = 1000, retry = Number.MAX_SAFE_INTEGER) {
  let i = 0;
  let ready = false;
  while(!ready && i < retry) {
    if (i !== 0) {
      // eslint-disable-next-line
      await delay(interval);
    }
    // eslint-disable-next-line
    i++;
    // eslint-disable-next-line
    ready = await isRendererReady();
  }
  return ready;
}

(async () => {
  console.log('check app-renderer ready...');
  const result = await pollingRenderer(500, 60);
  if (!result) {
    console.log('app-renderer failed to response')
    return;
  }
  console.log('app-renderer ready, start electron...');
  spawn('electron', [
    '-r',
    '@babel/register',
    path.join(__dirname, '../src/index.js')
  ], {
    cwd: path.join(__dirname, '../'),
    stdio: 'inherit',
  });
})();
