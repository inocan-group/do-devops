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
const async_shelljs_1 = require("async-shelljs");
function getGitLastCommit() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield async_shelljs_1.asyncExec("git rev-parse --short HEAD ", {
            silent: true
        });
        return result.replace("\n", "");
    });
}
exports.getGitLastCommit = getGitLastCommit;
