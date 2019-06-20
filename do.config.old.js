const config = {
  projectType: "serverless-library",
  build: {
    preBuildHooks: ["clean"],
    targetDirectory: "dist",
    buildTool: "tsc"
  },
  deploy: {
    preDeployHooks: ["clean"],
    deployTool: "serverless"
  },
  version: {}
};

module.exports = config;
