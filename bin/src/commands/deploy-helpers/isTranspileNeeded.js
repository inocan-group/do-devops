"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTranspileNeeded = void 0;
const chalk = require("chalk");
const file_1 = require("../../shared/file");
const date_fns_1 = require("date-fns");
const index_1 = require("../../shared/serverless/index");
/**
 * Tests whether webpack transpilation is needed
 * based on the timestamps of the source and transpiled files
 *
 * @param meta the meta information from CLI
 * @param fns optionally pass in a subset of functions which are being deployed
 */
function isTranspileNeeded(meta, fns) {
    const handlerInfo = index_1.getLocalHandlerInfo();
    const fnsNotTranspiled = handlerInfo.filter((i) => i.sourceModified > i.webpackModified);
    if (fnsNotTranspiled.length > 0) {
        console.log(chalk `{grey - there are ${String(fnsNotTranspiled.length)} which have NOT been transpiled since the source was modified: {dim ${fnsNotTranspiled
            .map((i) => i.fn)
            .join(", ")}}}`);
    }
    else {
        console.log(chalk `{grey - transpiled handler functions are newer than handler source {green ${"\uD83D\uDC4D" /* thumbsUp */}}}`);
    }
    const handlerFns = handlerInfo.map((i) => i.source);
    const sharedFnInfo = file_1.filesInfo(...file_1.getAllFilesOfType("ts").filter((i) => !handlerFns.includes(i)));
    const mostRecentShared = sharedFnInfo.reduce((agg, fn) => {
        return fn.stats.mtime > agg ? fn.stats.mtime : agg;
    }, new Date("1970-01-01"));
    const fnsOlderThanShared = handlerInfo.filter((i) => mostRecentShared > i.webpackModified ? { fn: i.fn, source: i.source } : false);
    if (fnsOlderThanShared.length > 0) {
        console.log(chalk `{dim {yellow - there are {bold {red ${String(fnsOlderThanShared.length)}}} transpiled handler functions which are {italic older} than shared files source ${"\uD83D\uDE21" /* angry */} }} [ {grey ${date_fns_1.format(mostRecentShared, "h:mm aaaa @ d MMM")}} ]`);
    }
    else {
        console.log(chalk `{grey - transpiled handler functions newer than shared functions {green ${"\uD83D\uDC4D" /* thumbsUp */}}}`);
    }
    const needsTranspilation = new Set(fnsOlderThanShared.map((i) => i.source));
    fnsNotTranspiled.forEach((i) => needsTranspilation.add(i.source));
    return Array.from(needsTranspilation);
}
exports.isTranspileNeeded = isTranspileNeeded;
