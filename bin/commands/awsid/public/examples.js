"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examples = void 0;
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
