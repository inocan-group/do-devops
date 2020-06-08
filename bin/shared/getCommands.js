"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommands = void 0;
const subCommands = require("../commands/index");
/**
 * returns a list of commands (e.g., ssm, info, etc.) supported by
 * `do-devops`
 */
function getCommands() {
    return Object.keys(subCommands).filter((i) => typeof subCommands[i] === "object" && subCommands[i].handler);
}
exports.getCommands = getCommands;
