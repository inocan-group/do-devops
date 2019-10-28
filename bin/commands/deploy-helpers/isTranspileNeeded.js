"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../shared/serverless/index");
const chalk_1 = __importDefault(require("chalk"));
const file_1 = require("../../shared/file");
/**
 * Tests whether webpack transpilation is needed
 * based on the timestamps of the source and transpiled files
 *
 * @param meta the meta information from CLI
 * @param fns optionally pass in a subset of functions which are being deployed
 */
function isTranspileNeeded(meta, fns) {
    const handlerInfo = index_1.getLocalHandlerInfo();
    const fnsNotTranspiled = handlerInfo.filter(i => i.sourceModified > i.webpackModified);
    if (fnsNotTranspiled.length > 0) {
        console.log(chalk_1.default `{grey - there are ${String(fnsNotTranspiled.length)} which have NOT been transpiled since the source was modified: {dim ${fnsNotTranspiled
            .map(i => i.fn)
            .join(", ")}}}`);
    }
    else {
        console.log(chalk_1.default `{grey - transpiled handler functions newer than handler source {green ${"\uD83D\uDC4D" /* thumbsUp */}}}`);
    }
    const handlerFns = handlerInfo.map(i => i.source);
    const sharedFnInfo = file_1.filesInfo(...file_1.getAllFilesOfType("ts").filter(i => !handlerFns.includes(i)));
    const mostRecentShared = sharedFnInfo.reduce((agg, fn) => {
        return fn.stats.mtime > agg ? fn.stats.mtime : agg;
    }, new Date("1970-01-01"));
    const fnsOlderThanShared = handlerInfo.filter(i => mostRecentShared > i.webpackModified
        ? { fn: i.fn, source: i.source }
        : false);
    if (fnsOlderThanShared.length > 0) {
        console.log(chalk_1.default `{dim {yellow - there are {bold {red ${String(fnsOlderThanShared.length)}}} transpiled handler functions which are older than changes made to shared files ${"\uD83D\uDE21" /* angry */} }}`);
    }
    else {
        console.log(chalk_1.default `{grey - transpiled handler functions newer than shared functions {green ${"\uD83D\uDC4D" /* thumbsUp */}}}`);
    }
    const needsTranspilation = new Set(fnsOlderThanShared.map(i => i.source));
    fnsNotTranspiled.forEach(i => needsTranspilation.add(i.source));
    return Array.from(needsTranspilation);
}
exports.isTranspileNeeded = isTranspileNeeded;
