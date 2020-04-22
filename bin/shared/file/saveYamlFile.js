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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = require("js-yaml");
const path = __importStar(require("path"));
const fs_1 = require("fs");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const write = util_1.promisify(fs_1.writeFile);
function saveYamlFile(filename, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(data);
            const yamlData = js_yaml_1.safeDump(data);
            const fqFilename = path.join(process.cwd(), filename);
            yield write(fqFilename, yamlData, { encoding: "utf-8" });
            return;
        }
        catch (e) {
            console.log(chalk_1.default `- {red writing the {bold {italic ${filename}} YAML file has failed!} ${"\uD83D\uDCA9" /* poop */}}`);
            console.log(e.message);
            console.log(chalk_1.default `{dim ${e.stack}}`);
            process.exit();
        }
    });
}
exports.saveYamlFile = saveYamlFile;
