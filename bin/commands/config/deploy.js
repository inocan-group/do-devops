"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deploy() {
    return {
        target: "serverless",
        showUnderlyingCommands: true,
        sandboxing: "user"
    };
}
exports.deploy = deploy;
