"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_shelljs_1 = require("async-shelljs");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
/**
 * because the build process involves `import`ing certain
 * files and these files _might_ have typing errors (or JS errors);
 * it's better to remove them or replace them with a very plain
 * vanilla version to avoid these problems. These files will all
 * be reproduced as part of the build process anyway.
 */
function clearOutFilesPriorToBuild() {
    return __awaiter(this, void 0, void 0, function* () {
        async_shelljs_1.rm(path_1.default.join(process.cwd(), "src/@types/build.ts"));
        fs_1.writeFileSync(path_1.default.join(process.cwd(), "serverless-config/functions/inline.ts"), { encoding: "utf-8" });
    });
}
exports.clearOutFilesPriorToBuild = clearOutFilesPriorToBuild;
