"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverlessYamlExists = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function serverlessYamlExists() {
    return fs_1.existsSync(path_1.join(process.cwd(), "serverless.yml"));
}
exports.serverlessYamlExists = serverlessYamlExists;
