"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const shared_1 = require("../shared");
const async_shelljs_1 = require("async-shelljs");
const table_1 = require("table");
/**
 * Gets the `git` and `npm` version of a file as well as
 * whether the local copy is dirty.
 */
function handler() {
    return __awaiter(this, void 0, void 0, function* () {
        // const config = await getConfig();
        const info = JSON.parse(yield async_shelljs_1.asyncExec("yarn info --json", { silent: true }));
        const { versions, keywords } = info.data;
        const gitLastCommit = stripCarraigeReturn(yield async_shelljs_1.asyncExec("git rev-parse --short HEAD ", {
            silent: true
        }));
        const gitBranch = stripCarraigeReturn(yield async_shelljs_1.asyncExec("git branch | sed -n '/* /s///p'", { silent: true }));
        const localFilesChanged = (yield async_shelljs_1.asyncExec("git diff --name-only", {
            silent: true
        })).split("\n").length;
        const { name, version, scripts, repository, description } = shared_1.getPackageJson();
        console.log(`Info on package ${chalk_1.default.green.bold(name)}`);
        const data = [
            [
                "NPM",
                `Latest published ${chalk_1.default.bold.green(versions.pop())}; locally in package.json is ${chalk_1.default.bold.green(version)}`
            ],
            [
                "Desc ",
                description
                    ? chalk_1.default.italic(description)
                    : chalk_1.default.grey.italic("no description provided")
            ],
            [
                "Repo ",
                repository && typeof repository === "object"
                    ? repository.url
                    : repository
                        ? repository
                        : `The repository is ${chalk_1.default.bold("not")} stated!`
            ],
            ["Tags ", keywords],
            ["Scripts", Object.keys(scripts).join(", ")],
            [
                "GIT",
                `Latest commit ${chalk_1.default.bold.green(gitLastCommit)} ${chalk_1.default.bold.italic("@ " + gitBranch)}; ${chalk_1.default.bold.green(String(localFilesChanged))} files changed locally`
            ]
        ];
        const config = {
            columns: {
                0: { width: 10, alignment: "center" },
                1: { width: 69 }
            }
        };
        console.log(table_1.table(data, config));
    });
}
exports.handler = handler;
function stripCarraigeReturn(input) {
    return input.replace(/\n/, "");
}
