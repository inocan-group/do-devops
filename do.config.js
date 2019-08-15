const config = {
  root: {
    projectType: "serverless-library"
  },
  build: {
    preBuildHooks: ["clean"],
    targetDirectory: "dist",
    buildTool: "tsc"
  },
  deploy: {
    preDeployHooks: [],
    target: "serverless",
    showUnderlyingCommands: true,
    sandboxing: "user"
  },
  ssm: {
    hasAwsInstalled: true,
    findProfileIn: "default"
  },
  default: {
    root: {
      projectType: "serverless-library"
    },
    build: {
      preBuildHooks: ["clean"],
      targetDirectory: "dist",
      buildTool: "tsc"
    },
    deploy: {
      preDeployHooks: ["clean"],
      target: "serverless",
      showUnderlyingCommands: true
    },
    ssm: {}
  }
};
module.exports = config;
