"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pkg = void 0;
function pkg() {
    return {
        preDeployHooks: ["clean"],
        showUnderlyingCommands: true,
    };
}
exports.pkg = pkg;
