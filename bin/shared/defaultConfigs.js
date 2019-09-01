"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const subCommands = __importStar(require("../commands/index"));
/**
 * returns a list of commands which have a "default configuration"
 */
function defaultConfigs() {
    return Object.keys(subCommands).filter((i) => typeof subCommands[i] === "object" &&
        subCommands[i].defaultConfig);
}
exports.defaultConfigs = defaultConfigs;
