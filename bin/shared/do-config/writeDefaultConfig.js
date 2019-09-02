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
const fs_1 = require("fs");
const getDefaultConfig_1 = require("./getDefaultConfig");
const index_1 = require("./index");
/**
 * **writeConfig**
 *
 * Writes the `do-devops` config file to either the **project**'s root
 * or User's **home directory**.
 */
function writeConfig(c, projectOrUserConfig = "project") {
    const filename = index_1.getConfigFilename(projectOrUserConfig);
    fs_1.writeFileSync(filename, "const config = " +
        JSON.stringify(c, null, 2) +
        ";\nmodule.exports = config;", {
        encoding: "utf-8"
    });
}
exports.writeConfig = writeConfig;
/**
 * Writes a sub-command's _section_ of the configuration.
 *
 * @param section The section to be updated
 * @param content The content to update with; if blank the default will be used
 * @param projectOrUserConfig States whether **user** or **project** config;
 * default is **project**
 */
function writeSection(section, content, projectOrUserConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        projectOrUserConfig = projectOrUserConfig ? projectOrUserConfig : "project";
        const sectionMeta = content ? content : getDefaultConfig_1.getDefaultConfig(section);
        const currentConfig = yield index_1.getConfig({ projectOrUserConfig });
        writeConfig(Object.assign({}, currentConfig, { [section]: sectionMeta }));
    });
}
exports.writeSection = writeSection;
/**
 * Writes a `do.config.js` file using the default properties
 * setup in this repo.
 */
function writeDefaultConfig() {
    writeConfig(getDefaultConfig_1.getFullDefaultConfig());
}
exports.writeDefaultConfig = writeDefaultConfig;
