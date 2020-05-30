"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function green(...thingy) {
    const stringThingy = thingy.map((i) => (typeof i === "number" ? formatNumber(i) : i)).join("");
    return chalk `{bold {green ${stringThingy}}}`;
}
exports.green = green;
function dim(thingy) {
    if (typeof thingy === "number") {
        thingy = formatNumber(thingy);
    }
    return chalk `{dim ${thingy}}`;
}
exports.dim = dim;
function formatNumber(num, decimalPlaces = 0) {
    const multiplier = Math.pow(10, decimalPlaces);
    const rounded = Math.round(num * multiplier) / multiplier;
    return rounded.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
