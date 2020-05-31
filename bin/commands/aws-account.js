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
function description() {
    return `Provides an easy way to access a particular (or all) AWS account ID's defined in the user's credentials file (~/.aws/credentials).`;
}
exports.description = description;
exports.signature = "<aws-profile-name>";
exports.examples = [
    {
        name: "Interactive",
        desc: "no parameters leads to an interactive session to determine profile",
        example: "do aws-account",
    },
    {
        name: "Specific",
        desc: "when you state a profile name it will return that profile",
        example: "do aws-account my-service",
    },
    {
        name: "All",
        desc: "the '--all' modifier will list all known profiles and their Account IDs",
        example: "do aws-account --all",
    },
];
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        //
    });
}
exports.handler = handler;
