"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfigSections = void 0;
const config = require("../config/index");
/**
 * returns a list of commands (or global scope) which have
 * a "default configuration"
 */
function defaultConfigSections() {
    return Object.keys(config).filter((i) => typeof config[i] === "function");
}
exports.defaultConfigSections = defaultConfigSections;
