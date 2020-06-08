"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYeomanConfig = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const chalk = require("chalk");
/**
 * returns the `.yo-rc.json` file combined with the
 * `.yo-transient.json` should they exist.
 *
 * Will always return a dictionary of some sort (even
 * if it's an empty dictionary)
 */
function getYeomanConfig(scaffold = "generator-lambda-typescript") {
    const yoFile = path_1.join(process.cwd(), ".yo-rc.json");
    const transientFile = path_1.join(process.cwd(), ".yo-transient.json");
    const hasYo = fs_1.existsSync(yoFile);
    const hasTransient = fs_1.existsSync(transientFile);
    let yo = {};
    let transient = {};
    if (hasYo) {
        try {
            yo = JSON.parse(fs_1.readFileSync(yoFile, "utf-8"))[scaffold];
        }
        catch (e) {
            console.log(chalk `- there appears to {italic be} a yeoman config file but it could not be parsed ${"\uD83D\uDCA9" /* poop */}`);
            console.log(chalk `{grey - Note: we are looking for the "${scaffold}" as a root property, other yeoman scaffoldings are not considered}`);
        }
    }
    if (hasTransient) {
        try {
            transient = JSON.parse(fs_1.readFileSync(transientFile, "utf-8"));
        }
        catch (e) {
            console.log(chalk `- there appears to be a {italic transient} yeoman config file -- {blue .yo-transient.json} -- but it could not be parsed ${"\uD83D\uDCA9" /* poop */}`);
        }
    }
    return Object.assign(Object.assign({}, transient), yo);
}
exports.getYeomanConfig = getYeomanConfig;
