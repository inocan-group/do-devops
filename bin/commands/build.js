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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const chalk_1 = __importDefault(require("chalk"));
exports.defaultConfig = {
    preBuildHooks: ["clean"],
    targetDirectory: "dist",
    buildTool: "tsc"
};
function description() {
    return `Efficient and clear build pipelines for serverless and/or NPM libraries`;
}
exports.description = description;
function handler() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default `- building the {bold {green serverless.yml}} file ${"\uD83C\uDF89" /* party */}`);
        yield shared_1.buildServerlessMicroserviceProject();
    });
}
exports.handler = handler;
