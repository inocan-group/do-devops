"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
/**
 * Returns the path to the file if found, if not found then returns
 * `false`.
 */
function hasAwsProfileCredentialsFile() {
    const homedir = require("os").homedir();
    const filePath = path.join(homedir, ".aws/credentials");
    return fs_1.existsSync(filePath) ? filePath : false;
}
exports.hasAwsProfileCredentialsFile = hasAwsProfileCredentialsFile;
