"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("../commands/config/index"));
/**
 * returns a list of commands (or global scope) which have
 * a "default configuration"
 */
function defaultConfigSections() {
    return Object.keys(config).filter((i) => typeof config[i] === "function");
}
exports.defaultConfigSections = defaultConfigSections;
