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
/**
 * **write**
 *
 * Writes a file to the filesystem; favoring files which are based off the repo's
 * root
 *
 * @param filename the filename to be written; if filename doesn't start with either a '.' or '/' then it will be joined with the projects current working directory
 * @param data the data to be written
 */
function write(filename, data) {
    return __awaiter(this, void 0, void 0, function* () {
        //
    });
}
exports.write = write;
