"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
function deploy() {
    return {
        target: "serverless",
        showUnderlyingCommands: true,
        sandboxing: "user",
    };
}
exports.deploy = deploy;
