"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includedIn = void 0;
/**
 * returns a boolean flag based on whether the current branch is considered to be
 * within one of the _valid_ branches. This function returns `true` if the current branch
 * is a direct match to the valid branches but also if a valid branch is a _subset_ of the
 * current branch name.
 *
 * For instance, if the current branch is `feature/foobar` and the valid branches includes
 * `feature` then this will match.
 */
function includedIn(currentBranch, validBranches) {
    let flag = false;
    validBranches.forEach((b) => {
        if (currentBranch.includes(b))
            flag = true;
    });
    return flag;
}
exports.includedIn = includedIn;
