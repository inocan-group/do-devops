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
exports.description = void 0;
const chalk = require("chalk");
const autoindex = chalk `{bgWhite {blackBright  autoindex }}`;
exports.description = () => __awaiter(void 0, void 0, void 0, function* () {
    return chalk `Automates the building of {italic index} files; if you include a comment starting with {bold {yellow // #autoindex}} in a index file it will be auto-indexed when calling {blue do autoindex}.
  
  By default ${autoindex} will assume that you are using {italic named} exports but this can be configured to what you need. Options are: {italic named, default,} and {italic named-offset}. To configure, simply add something like {bold {yellow //#autoindex:default}} to your file.
  
  If you need to exclude certain files you can state the exclusions after the autoindex declaration: {bold {yellow //#autoindex, exclude:a,b,c}}`;
});
