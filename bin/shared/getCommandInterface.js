"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands = require("../commands/index");
function getCommandInterface(cmd) {
    const cmdDefn = commands[cmd];
    return cmdDefn;
}
exports.getCommandInterface = getCommandInterface;
