"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentGitBranch = void 0;
const git_1 = require("./git");
/**
 * returns the _current_ git branch in the given repo
 */
function getCurrentGitBranch(baseDir) {
    return __awaiter(this, void 0, void 0, function* () {
        baseDir = baseDir ? baseDir : process.cwd();
        const g = git_1.git(baseDir);
        const branch = yield g.branch();
        return branch.current;
    });
}
exports.getCurrentGitBranch = getCurrentGitBranch;
