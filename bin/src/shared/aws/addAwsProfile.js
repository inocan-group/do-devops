"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAwsProfile = void 0;
const path = require("path");
const fs_1 = require("fs");
/** adds a new profile to a user's `~/.aws/credentials` file */
function addAwsProfile(name, profile) {
    const homedir = require("os").homedir();
    const filePath = path.join(homedir, ".aws/credentials");
    const fileContents = fs_1.readFileSync(filePath, "utf-8");
    if (fileContents.includes(`[${name}]`)) {
        throw new Error(`The AWS profile "${name}" already exists, attempt to add it has failed!`);
    }
    let newProfile = `\n[${name}]\n`;
    Object.keys(profile).forEach((key) => {
        newProfile += `${key} = ${profile[key]}\n`;
    });
    fs_1.appendFileSync(filePath, newProfile);
}
exports.addAwsProfile = addAwsProfile;
