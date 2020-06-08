"use strict";
// #auto   index:named-offset
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: make an autoindex (named-offset)
//#region autoindexed files
// indexed at: 5th May, 2020, 01:23 PM ( GMT-7 )
exports.build = require("./build");
exports.deploy = require("./deploy");
exports.endpoints = require("./endpoints");
exports.fns = require("./fns");
exports.global = require("./global");
exports.help = require("./help");
exports.info = require("./info");
exports.invoke = require("./invoke");
exports.pkg = require("./pkg");
exports.ssm = require("./ssm");
exports.test = require("./test");
exports.autoindex = require("./autoindex/index");
exports.awsid = require("./awsid/index");
exports.layers = require("./layers/index");
__exportStar(require("./build-helpers/index"), exports);
__exportStar(require("./deploy-helpers/index"), exports);
//#endregion
