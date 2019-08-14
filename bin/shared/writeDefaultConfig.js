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
const config_1 = require("./config");
/**
 * **writeConfig**
 *
 * Writes the `do-devops` config file
 */
function writeConfig(c) {
    const filename = config_1.getConfigFilename();
    fs_1.writeFileSync(filename, "const config = " +
        JSON.stringify(c, null, 2) +
        ";\nmodule.exports = config;", {
        encoding: "utf-8"
    });
}
exports.writeConfig = writeConfig;
function writeSection(section, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const sectionMeta = content ? content : config_1.getDefaultForConfigSection(section);
        const currentConfig = yield config_1.getConfig();
        writeConfig(Object.assign({}, currentConfig, { [section]: sectionMeta }));
    });
}
exports.writeSection = writeSection;
function writeWholeFile() {
    writeConfig(config_1.getDefaultConfig());
}
exports.writeWholeFile = writeWholeFile;
