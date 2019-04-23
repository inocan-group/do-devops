import IDoConfig from 'devops';
export default {
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
    "deployTool": "serverless"
  }
} as IDoConfig
