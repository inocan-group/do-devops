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
const index_1 = require("../index");
/**
 * **getDefaultConfig**
 *
 * Returns the _default config_ for a given command. If you want to
 * get the "global" defaults just use `global` as the _command_.
 */
function getDefaultConfig(command) {
    if (!command) {
        const sections = ;
    }
    if (!defaults[command]) {
        throw new index_1.DevopsError(`Attempt to get the defaults for the "${command}" command failed because there is no file defining it!`, "devops/not-ready");
    }
    if (typeof defaults[command] !== "function") {
        throw new index_1.DevopsError(`Attempt to get the defaults for the "${command}" command failed because while there IS a file defining it it does not have a default export which is a function!`, "devops/not-allowed");
    }
    return defaults[command]();
}
exports.getDefaultConfig = getDefaultConfig;
