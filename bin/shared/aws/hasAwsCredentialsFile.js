"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
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
