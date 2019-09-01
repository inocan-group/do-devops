"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../../shared");
exports.DoSsmOptions = [
    {
        name: "profile",
        alias: "p",
        type: String,
        group: "ssm",
        description: "explicitly state the AWS profile to use (otherwise assumes value in current repos 'serverless.yml')",
        typeLabel: "<name>"
    },
    {
        name: "region",
        alias: "r",
        type: String,
        group: "ssm",
        description: "explicitly state the AWS region (note: this overrides profile if set)",
        typeLabel: "<region>"
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        group: "ssm",
        description: `shows help for the ${shared_1.inverted(" ssm ")} command in general but also the specifics of a particular sub-command if stated`
    }
];
