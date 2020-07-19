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
  },
  "test": {
    "unitTestFramework": "mocha",
    "testDirectory": "test",
    "testPattern": "**/*-spec.ts"
  }
};
module.exports = config;