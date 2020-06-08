"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const chalk = require("chalk");
exports.options = [
    {
        name: "add",
        type: String,
        group: "autoindex",
        description: `adds additional files to include as possible autoindex sources; you can comma delimit to add more than one`,
    },
    {
        name: "glob",
        type: String,
        group: "autoindex",
        description: `replaces the glob file matching pattern with your own (however "node_modules" still excluded)`,
    },
    {
        name: "dir",
        type: String,
        group: "autoindex",
        description: `by default will look for files in the "src" directory but you can redirect this to a different directory`,
    },
    {
        name: "quiet",
        alias: "q",
        type: Boolean,
        group: "autoindex",
        description: chalk `stops most output to {italic stdout}; changes are still output`,
    },
    {
        name: "watch",
        alias: "w",
        type: Boolean,
        group: "autoindex",
        description: chalk `watches for changes and runs {italic autoindex} when detected`,
    },
];
