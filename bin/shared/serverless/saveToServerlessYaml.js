"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const util_1 = require("util");
const js_yaml_1 = require("js-yaml");
const writeFile = util_1.promisify(fs.writeFile);
function saveToServerlessYaml(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filename = path.join(process.cwd(), "serverless.yml");
            const yamlData = js_yaml_1.safeDump(data);
            yield writeFile(filename, yamlData, { encoding: "utf-8" });
        }
        catch (e) {
            console.log(chalk `- {red writing the {bold serverless.yml} file has failed!} ${"\uD83D\uDCA9" /* poop */}`);
            console.log(e.message);
            console.log(chalk `{dim ${e.stack}}`);
            process.exit();
        }
    });
}
exports.saveToServerlessYaml = saveToServerlessYaml;
