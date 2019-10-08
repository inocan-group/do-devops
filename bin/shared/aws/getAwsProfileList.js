"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const readFile_1 = require("../readFile");
/**
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 *
 * Returns _false_ if the credentials file is not found.
 */
function getAwsProfileList() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentialsFile = index_1.hasAwsProfileCredentialsFile();
            if (!credentialsFile) {
                return false;
            }
            const data = yield readFile_1.readFile(credentialsFile);
            const targets = ["aws_access_key_id", "aws_secret_access_key", "region"];
            // extracts structured information from the semi-structured
            // array of arrays
            const extractor = (agg, curr) => {
                let profileSection = "unknown";
                curr.forEach(lineOfFile => {
                    if (lineOfFile.slice(-1) === "]") {
                        profileSection = lineOfFile.slice(0, lineOfFile.length - 1);
                        agg[profileSection] = {};
                    }
                    targets.forEach(t => {
                        if (lineOfFile.includes(t)) {
                            const [devnull, key, value] = lineOfFile.match(/\s*(\S+)\s*=\s*(\S+)/);
                            agg[profileSection][key] = value;
                        }
                    });
                });
                return agg;
            };
            const credentials = data
                .split("[")
                .map(i => i.split("\n"))
                .reduce(extractor, {});
            return credentials;
        }
        catch (e) {
            return false;
        }
    });
}
exports.getAwsProfileList = getAwsProfileList;
