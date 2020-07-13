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
const chalk = require("chalk");
const shared_1 = require("../../../../shared");
function handler(action, currentBranch, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk `- ${"\uD83D\uDC40" /* eyeballs */} ensuring that all {italic semver} versions are ready for an {bold {yellow npm}} release`);
        const latest = (yield shared_1.gitTags()).latest;
        const pkgVersion = shared_1.getPackageJson().version;
        const releaseTag = currentBranch.includes("release/") ? currentBranch.split("/")[1] : undefined;
        console.log(chalk `- the last semver tag in the remote is {bold {yellow ${latest}}}`);
        console.log(chalk `- the semver value in {italic package.json} is {bold {yellow ${pkgVersion}}}`);
        if (releaseTag)
            console.log(chalk `- the {italic release} branch has a tag of {bold {yellow ${releaseTag}}}`);
        if (releaseTag && releaseTag !== pkgVersion) {
            console.log(chalk `- ${"\uD83D\uDCA9" /* poop */} the release branch's tag and the package.json tag DO NOT match!\n`);
            return action === "error" ? 1 : 0;
        }
        if (latest === pkgVersion) {
            console.log(chalk `- ${"\uD83D\uDCA9" /* poop */} the package.json's version must be greater than what the remote already has!\n`);
            return action === "error" ? 1 : 0;
        }
        const [remoteMajor, remoteMinor, remotePatch] = latest.split(".").map((i) => Number(i));
        const [localMajor, localMinor, localPatch] = pkgVersion.split(".").map((i) => Number(i));
        const remoteValue = remoteMajor * 10000 + remoteMinor * 1000 + remotePatch;
        const localValue = localMajor * 10000 + localMinor * 1000 + localPatch;
        if (localValue < remoteValue) {
            console.log(chalk `- ${"\uD83D\uDCA9" /* poop */} the package.json's version is {bold {red less than}} the remote!\n`);
            return action === "error" ? 1 : 0;
        }
        const versionScope = localMajor > remoteMajor ? "major" : localMinor > remoteMinor ? "minor" : "patch";
        console.log(chalk `- ${"\uD83C\uDF89" /* party */} versions appear to be ready to do a {bold {green ${versionScope}
}} NPM release`);
        return 0;
    });
}
exports.handler = handler;
