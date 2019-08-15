"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_shelljs_1 = require("async-shelljs");
const index_1 = require("./git/index");
/**
 * Determines the `stage` to replace "dev" with a more
 * isolated sandboxing strategy; based on the user's
 * sandbox configuration
 */
function sandbox(strategy) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (strategy) {
            case "user":
                const user = (yield async_shelljs_1.asyncExec("git config user.name"))
                    .replace(/ /g, "")
                    .replace(/\-/g, "")
                    .toLowerCase();
                return user || "dev";
            case "branch":
                const branch = yield index_1.gitBranch();
                switch (branch) {
                    case "develop":
                        return "dev";
                    case "master":
                        throw new Error('You can not deploy stage "dev" to the master branch.');
                    default:
                        const isFeatureBranch = branch.includes("feature");
                        return isFeatureBranch
                            ? branch.replace(/.*\//, "").replace(/\-/g, "")
                            : "dev";
                }
            default:
                return "dev";
        }
    });
}
exports.sandbox = sandbox;
