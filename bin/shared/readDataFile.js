"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const process = __importStar(require("process"));
const index_1 = require("./index");
/**
 * Reads a file from the `test/data` directory
 */
function readDataFile(file, defaultExtension) {
    return __awaiter(this, void 0, void 0, function* () {
        if (defaultExtension && defaultExtension.slice(0, 1) === ".") {
            defaultExtension = defaultExtension.slice(1);
        }
        let filename = path.join(process.cwd(), "test/data", file);
        if (defaultExtension && !file.includes("." + defaultExtension)) {
            filename += "." + defaultExtension;
        }
        return index_1.readFile(filename);
    });
}
exports.readDataFile = readDataFile;
