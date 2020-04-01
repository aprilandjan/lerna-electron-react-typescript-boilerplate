/** 注入到客户端，上报 cov-report */
// const { ipcMain, ipcRenderer } = require('electron');

//  一些配置
const port = process.env.COV_REPORT_PORT || 8889;
const endPoint = `http://localhost:${port}/coverage/client`;
const reportInterval = 2000;
// const event = 'COV_REPORT_RENDERER';

function initReport() {
  if (global.__coverageReportId__) {
    return;
  }
  let reportId;
  if (process.type === 'renderer') {
    //  渲染进程直接 fetch
    reportId = initReportRenderer(reportInterval);
  } else {
    //  主进程通过 node 模块
    reportId = initReportMain(reportInterval);
  }
  global.__coverageReportId__ = reportId;
}

/** 渲染进程上报 */
function initReportRenderer(interval) {
  const report = () => {
    fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(window.__coverage__),
    })
      .then(data => {
        // console.log(process.type, 'report success');
      })
      .catch(e => {
        // console.log(process.type, 'report error');
      });
  };
  // const report = () => {
  //   ipcRenderer.send(event, window.__coverage__);
  // };
  return setInterval(report, interval);
}

/** 主进程上报 */
function initReportMain(interval) {
  const http = require('http');
  const report = cov => {
    const data = JSON.stringify(cov);
    const req = http.request(
      endPoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      },
      res => {
        res.on('error', e => {
          // console.log(process.type, 'report error', e);
        });
        res.on('end', () => {
          // console.log(process.type, 'report success');
        });
      }
    );
    req.on('error', e => {
      // console.log(process.type, 'report error', e);
    });
    req.write(data);
    req.end();
  };
  // ipcMain.on(event, (e, rendererCov) => {
  //   report(rendererCov);
  // });
  return setInterval(() => {
    report(global.__coverage__);
  }, interval);
}

initReport();
