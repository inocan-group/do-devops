"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands = __importStar(require("../commands/index"));
function getCommandInterface(cmd) {
    const cmdDefn = commands[cmd];
    return cmdDefn;
}
exports.getCommandInterface = getCommandInterface;
