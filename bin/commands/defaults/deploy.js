"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deploy() {
    return {
        preDeployHooks: ["clean"],
        deployTool: "serverless"
    };
}
exports.deploy = deploy;
