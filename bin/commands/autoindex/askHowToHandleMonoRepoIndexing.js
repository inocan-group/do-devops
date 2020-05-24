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
const inquirer_1 = __importDefault(require("inquirer"));
function askHowToHandleMonoRepoIndexing(pkgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const choices = pkgs.concat("ALL");
        const message = `This repo appears to be a monorepo. Please choose\nwhich repo(s) you want to run autoindex on:`;
        const question = {
            message,
            type: "list",
            name: "repo",
            choices,
            default: "ALL",
        };
        return (yield inquirer_1.default.prompt(question)).repo;
    });
}
exports.askHowToHandleMonoRepoIndexing = askHowToHandleMonoRepoIndexing;
