const express = require('express');
const coverage = require('istanbul-middleware');

const port = process.env.COV_REPORT_PORT || 8889;

const app = express();
app.use(
  '/coverage',
  coverage.createHandler({
    verbose: true,
    resetOnGet: true,
  })
);

app.get('/', (_req, res) => {
  res.send(`
    <div><a href="/coverage">Live Coverage</a></div>
    <div><a href="/coverage/reset">Reset Collected</a></div>
    <div><a href="/coverage/download">Download Report</a></div>
  `);
});

app.listen(port, _e => {
  console.log(`server started at http://localhost:${port}`);
});
