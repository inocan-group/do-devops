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
const index_1 = require("./index");
/**
 * Gets the list of functions defined in the `serverless.yml`
 * file.
 */
function getLocalServerlessFunctionsFromServerlessYaml() {
    return __awaiter(this, void 0, void 0, function* () {
        return index_1.serverlessYamlExists() ? (yield index_1.getServerlessYaml()).functions : {};
    });
}
exports.getLocalServerlessFunctionsFromServerlessYaml = getLocalServerlessFunctionsFromServerlessYaml;
