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
exports.getServerlessYaml = void 0;
const fs = require("fs");
const path = require("path");
const errors_1 = require("../errors");
const js_yaml_1 = require("js-yaml");
/**
 * Get the `serverless.yml` file in the root of the project
 */
function getServerlessYaml() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseStructure = {
            functions: {},
            stepFunctions: { stateMachines: {} },
        };
        try {
            const fileContents = fs.readFileSync(path.join(process.cwd(), "serverless.yml"), {
                encoding: "utf-8",
            });
            const config = js_yaml_1.safeLoad(fileContents);
            return Object.assign(Object.assign({}, baseStructure), config);
        }
        catch (e) {
            throw new errors_1.DevopsError(`Failure getting serverless.yml: ${e.message}`, e.name);
        }
    });
}
exports.getServerlessYaml = getServerlessYaml;
