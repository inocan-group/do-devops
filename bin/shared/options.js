"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
exports.DoGlobalOptions = [
    {
        name: "profile",
        alias: "p",
        type: String,
        group: "global",
        description: "explicitly state the AWS profile to use (otherwise assumes value in current repos 'serverless.yml')",
        typeLabel: "<name>"
    },
    {
        name: "region",
        alias: "r",
        type: String,
        group: "global",
        description: "explicitly state the AWS region (note: this overrides profile if set)",
        typeLabel: "<region>"
    },
    {
        name: "output",
        alias: "o",
        type: String,
        group: "global",
        description: "sends output to the filename specified",
        typeLabel: "<filename>"
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        group: "global",
        description: `shows help for the ${_1.inverted(" ssm ")} command in general but also the specifics of a particular sub-command if stated`
    }
];
