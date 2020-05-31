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
    return `Given a user has their AWS credentials file configured, provides easy access to a particular (or all) AWS account ID's for the given user.`;
}
exports.description = description;
exports.signature = "<profile-name> | <empty>";
exports.examples = [
    {
        name: "Interactive",
        desc: "no parameters leads to an interactive session to determine profile",
        example: "do aws-account",
    },
];
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.handler = handler;
