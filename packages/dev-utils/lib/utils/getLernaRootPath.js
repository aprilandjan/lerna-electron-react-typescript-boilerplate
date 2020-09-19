const LernaProject = require('@lerna/project');

/** get root path of current lerna project root path */
module.exports = function(cwd = process.cwd()) {
  const project = new LernaProject(cwd);
  return project.rootPath;
};
