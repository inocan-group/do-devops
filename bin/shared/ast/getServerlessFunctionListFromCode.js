"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function getServerlessFunctionListFromCode() {
    const allFiles = fg.sync(path_1.default.join(process.env.PWD, "/src/handlers/**/*.ts"));
    return allFiles.reduce((agg, curr) => {
        const ast = parseFile(curr);
        const loc = ast.program.body[0].source.loc;
        if (loc.tokens.find((i) => i.value === "handler")) {
            agg.push(curr);
        }
        return agg;
    }, []);
}
exports.getServerlessFunctionListFromCode = getServerlessFunctionListFromCode;
