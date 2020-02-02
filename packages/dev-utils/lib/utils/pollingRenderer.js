// const path = require('path');
const http = require('http');
const logger = require('./logger');
const env = require('./env');

async function isRendererReady() {
  return new Promise(resolve => {
    http
      .get(`http://${env.host}:${env.port}/dev-server-status`, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          if (data === 'ready') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      })
      .on('error', () => {
        resolve(false);
      });
  });
}

async function delay(t) {
  return new Promise(resolve => setTimeout(resolve, t));
}

module.exports = async function pollingRenderer(interval = 500, retry = 60) {
  let i = 0;
  let ready = false;
  while (!ready && i < retry) {
    if (i !== 0) {
      // eslint-disable-next-line
      await delay(interval);
    }
    // eslint-disable-next-line
    i++;
    logger.debug(`check is renderer ready... #${i}/${retry}`);
    // eslint-disable-next-line
    ready = await isRendererReady();
  }
  return ready;
};
