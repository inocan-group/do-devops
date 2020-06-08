"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandInterface = void 0;
const commands = require("../commands/index");
function getCommandInterface(cmd) {
    const cmdDefn = commands[cmd];
    if (!cmdDefn.handler) {
        throw new Error(`The command "${cmd}" is not known`);
    }
    if (!cmdDefn.description) {
        console.warn(`The command "${cmd}" has been defined but does NOT have a description which is a informal part of the contract!`);
    }
    return cmdDefn;
}
exports.getCommandInterface = getCommandInterface;
