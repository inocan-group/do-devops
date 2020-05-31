"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults = require("../../config");
/**
 * **getConfigSections**
 *
 * returns a list of configuration section _names_; this does NOT
 * include the `global` section
 */
function getConfigSections() {
    return Object.keys(defaults).filter((section) => {
        return typeof defaults[section] === "function";
    });
}
exports.getConfigSections = getConfigSections;
