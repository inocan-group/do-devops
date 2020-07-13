"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const chalk = require("chalk");
exports.options = [
    {
        name: "default",
        type: String,
        description: "the default action type for all branches [none, warn, error]",
    },
    {
        name: "error",
        type: String,
        description: chalk `the {italic branches} which should be moved to {bold 'error'} status; you can comma-delimit for more than one`,
    },
    {
        name: "warn",
        type: String,
        description: chalk `the {italic branches} which should be moved to {bold 'warn'} status; you can comma-delimit for more than one`,
    },
];
