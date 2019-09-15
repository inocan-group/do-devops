const config = {
  "global": {
    "projectType": "serverless-library"
  },
  "build": {
    "targetDirectory": "dist",
    "buildTool": "tsc"
  },
  "deploy": {
    "target": "serverless",
    "showUnderlyingCommands": true,
    "sandboxing": "user"
  },
  "pkg": {
    "preDeployHooks": [
      "clean"
    ],
    "showUnderlyingCommands": true
  }
};
module.exports = config;