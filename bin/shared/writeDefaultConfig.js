"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const config_1 = require("./config");
function writeConfig(c) {
    const filename = config_1.getConfigFilename();
    fs_1.writeFileSync(filename, "const config = " + JSON.stringify(c, null, 2) + ";\nmodule.exports = config;", {
        encoding: "utf-8"
    });
}
exports.writeConfig = writeConfig;
function writeSection(section) {
    const sectionMeta = config_1.getDefaultForConfigSection(section);
    const currentConfig = config_1.getCurrentConfig();
    writeConfig(Object.assign({}, currentConfig, { [section]: sectionMeta }));
}
exports.writeSection = writeSection;
function writeWholeFile() {
    writeConfig(config_1.getDefaultConfig());
}
exports.writeWholeFile = writeWholeFile;
