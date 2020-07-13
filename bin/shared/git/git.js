"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.git = void 0;
const simple_git_1 = require("simple-git");
/**
 * Returns an instance of the [`SimpleGit` library](https://github.com/steveukx/git-js)
 */
function git(baseDir = undefined, options = {}) {
    if (!baseDir) {
        baseDir = process.cwd();
    }
    return simple_git_1.default(baseDir, options);
}
exports.git = git;
