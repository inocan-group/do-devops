const config = {
  "projectType": "serverless-library",
  "build": {
    "preBuildHooks": [
      "clean"
    ],
    "targetDirectory": "dist",
    "buildTool": "tsc"
  },
  "deploy": {
    "preDeployHooks": [
      "clean"
    ],
    "deployTool": "serverless",
    "showUnderlyingCommands": true
  }
};
module.exports = config;