"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaults = __importStar(require("../../commands/defaults"));
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
