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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const shared_1 = require("../shared");
const async_shelljs_1 = require("async-shelljs");
const table_1 = require("table");
const date_fns_1 = require("date-fns");
exports.description = `Summarized information about the current repo`;
exports.options = [
    {
        name: "test",
        alias: "t",
        type: String,
        group: "info",
        description: "sends output to the filename specified",
        typeLabel: "<filename>"
    }
];
/**
 * Gets the `git` and `npm` version of a file as well as
 * whether the local copy is dirty.
 */
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        // const config = await getConfig();
        let npm;
        try {
            npm = yield shared_1.getPackageInfo();
        }
        catch (e) {
            // appears NOT to be a NPM package
        }
        const pkg = yield shared_1.getPackageJson();
        const priorVersions = npm
            ? npm.versions
                .filter(i => i !== npm.version)
                .slice(0, 5)
                .join(", ")
            : "";
        const gitLastCommit = yield shared_1.getGitLastCommit();
        const branch = yield shared_1.getGitBranch();
        const localFilesChanged = (yield async_shelljs_1.asyncExec("git diff --name-only", {
            silent: true
        })).split("\n").length;
        const dateFormat = "ddd dd MMM yyyy";
        /**
         * NPM Info based on verbose flag
         */
        const npmInfo = [
            [
                true,
                npm
                    ? chalk_1.default `This repo was first published on {green ${date_fns_1.format(date_fns_1.parseISO(npm.time.created), dateFormat)}} and last modified on {green ${date_fns_1.format(date_fns_1.parseISO(npm.time.modified), dateFormat)}}.\n\n`
                    : ""
            ],
            [
                false,
                npm
                    ? chalk_1.default `The latest published version is ${chalk_1.default.bold.green(npm.version)} [ ${date_fns_1.format(date_fns_1.parseISO(npm.time[npm.version]), dateFormat)} ].\nLocally in package.json, version is ${chalk_1.default.bold.green(pkg.version)}.`
                    : `Locally in {italic package.json}, the version is ${chalk_1.default.bold.green(pkg.version)} but this is {italic not} an npm package.`
            ],
            [true, chalk_1.default `\n\nPrior versions include: {italic ${priorVersions}}`],
            [
                true,
                npm && npm.author
                    ? chalk_1.default `\n\nThe author of the repo is {green {bold ${typeof npm.author === "string" ? npm.author : npm.author.name}${typeof npm.author === "object" && npm.author.email
                        ? ` <${npm.author.email}>`
                        : ""}}}`
                    : ""
            ]
        ];
        const depsSummary = `There are ${shared_1.green(Object.keys(pkg.dependencies).length)} dependencies${npm
            ? chalk_1.default `, with a total of ${shared_1.green(npm.dist.fileCount)} files\nand a unpacked size of ${shared_1.green(npm.dist.unpackedSize / 1000, chalk_1.default ` {italic kb}`)}.`
            : "."}`;
        const depDetails = `${depsSummary}\n\nThe dependencies are:\n - ${shared_1.dim(Object.keys(pkg.dependencies).join("\n - "))}`;
        const pkgJson = shared_1.getPackageJson();
        console.log(`Info on package ${chalk_1.default.green.bold(pkg.name)}`);
        const data = [
            [
                "Desc ",
                exports.description
                    ? pkg.description
                    : chalk_1.default.bold.italic("no description provided!")
            ],
            [
                "NPM",
                npmInfo
                    .filter(i => opts.verbose || !i[0])
                    .map(i => i[1])
                    .join("")
            ],
            ["Deps ", opts.verbose === true ? depDetails : depsSummary],
            [
                "Repo ",
                pkg.repository && typeof pkg.repository === "object"
                    ? pkg.repository.url
                    : pkg.repository
                        ? pkg.repository
                        : chalk_1.default.red(`The repository is ${chalk_1.default.bold("not")} stated!`)
            ],
            ["Tags ", pkg.keywords],
            ["Scripts", Object.keys(pkg.scripts).join(", ")],
            [
                "GIT",
                `Latest commit ${shared_1.green(gitLastCommit)} ${chalk_1.default.bold.italic("@ " + branch)}; ${shared_1.green(String(localFilesChanged))} files changed locally`
            ]
        ];
        const tblConfig = {
            columns: {
                0: { width: 10, alignment: "center" },
                1: { width: 69 }
            }
        };
        console.log(table_1.table(data, tblConfig));
    });
}
exports.handler = handler;
function stripCarraigeReturn(input) {
    return input.replace(/\n/, "");
}
