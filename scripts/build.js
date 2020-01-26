const run = require('./utils/run');

//  FIXME: build should be sequenced. use gulp instead?
run('app-main', 'build', false);
run('app-renderer', 'build', false);
