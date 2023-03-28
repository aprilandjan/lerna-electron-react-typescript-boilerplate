// when in development, the main dev will ensure the other modules ready
process.env.MONO_REPO_DEV = 1;

const run = require('./utils/run');

run('app-main', 'dev');
run('app-worker', 'dev');
run('app-renderer', 'dev');
run('app-common', 'dev');
run('dev-modules');
