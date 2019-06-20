"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deploy() {
    return {
        preDeployHooks: ["clean"],
        target: "serverless",
        showUnderlyingCommands: true
    };
}
exports.deploy = deploy;
