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
const errors_1 = require("../errors");
/**
 * Calls on the network to get `yarn info [xxx]`;
 * if the package name is excluded then it just
 * looks for the local package and throws an error
 * if not found
 */
function getPackageInfo(pkg = "") {
    return __awaiter(this, void 0, void 0, function* () {
        let npm;
        try {
            npm = JSON.parse(yield async_shelljs_1.asyncExec("yarn info --json", { silent: true }))
                .data;
            return npm;
        }
        catch (e) {
            // appears NOT to be a NPM package
            throw new errors_1.DevopsError(pkg
                ? `The package ${pkg} does not exist in NPM.`
                : `The local package does not exist in NPM.`, `devops/does-not-exist`);
        }
    });
}
exports.getPackageInfo = getPackageInfo;
