"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deploy() {
    return {
        preDeployHooks: ["clean"],
        showUnderlyingCommands: true
    };
}
exports.deploy = deploy;
