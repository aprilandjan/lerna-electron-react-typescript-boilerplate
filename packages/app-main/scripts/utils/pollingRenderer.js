// const path = require('path');
const http = require('http');

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

module.exports = async function pollingRenderer(interval = 500, retry = 60) {
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
