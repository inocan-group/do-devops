"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function build() {
    return {
        preBuildHooks: ["clean"],
        targetDirectory: "dist",
        buildTool: "tsc"
    };
}
exports.build = build;
