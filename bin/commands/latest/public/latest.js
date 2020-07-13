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
exports.handler = void 0;
const git_1 = require("../../../shared/git/git");
const shared_1 = require("../../../shared");
const chalk = require("chalk");
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const g = git_1.git();
        const latest = (yield g.tags()).latest;
        const status = yield g.status();
        const pkgVersion = shared_1.getPackageJson().version;
        const aheadBehind = status.ahead === 0 && status.behind === 0
            ? ``
            : `\n- Your local repo is ${status.ahead > 0 ? `ahead by ${status.ahead} commits` : `behind by ${status.behind} commits`}`;
        const changes = status.not_added.length === 0 && status.modified.length === 0
            ? ``
            : chalk `\n- Locally you have {yellow ${status.not_added.length > 0 ? status.not_added.length : "zero"}} {italic new} files and {yellow ${status.modified.length}} {italic modified} files`;
        const conflicts = status.conflicted.length === 0
            ? ``
            : chalk `- ${"\uD83D\uDCA9" /* poop */} There are {bold {red ${status.conflicted.length}}} conflicted files!`;
        if (opts.verbose) {
            console.log(chalk `The remote repo's latest version is {bold {yellow ${latest}}}; {blue package.json} is ${pkgVersion === latest ? `the same` : `is {bold ${pkgVersion}}`}.${aheadBehind}${changes}${conflicts}`);
            console.log("\n");
        }
        else {
            console.log(latest);
        }
        return latest;
    });
}
exports.handler = handler;
