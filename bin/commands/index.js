"use strict";
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
// #auto  index:named-offset, exclude build-helpers, deploy-helpers
__exportStar(require("./build-helpers/index"), exports);
__exportStar(require("./deploy-helpers/index"), exports);
//#region autoindexed files
// indexed at: 6th Jun, 2020, 10:26 AM ( GMT-7 )
// local file exports
exports.build = require("./build");
exports.deploy = require("./deploy");
exports.endpoints = require("./endpoints");
exports.fns = require("./fns");
// export * as global from "./global";
// export * as help from "./help";
exports.info = require("./info");
exports.invoke = require("./invoke");
exports.pkg = require("./pkg");
exports.ssm = require("./ssm");
exports.test = require("./test");
// directory exports
exports.autoindex = require("./autoindex/index");
exports.awsid = require("./awsid/index");
exports.layers = require("./layers/index");
//#endregion
