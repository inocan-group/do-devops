"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclusions = void 0;
function exclusions(file) {
    return file.includes("exclude:")
        ? file
            .replace(/[^\0]*exclude:([^;|\n]*)[\n|;][^\0]*/g, "$1")
            .split(",")
            .map((i) => i.trim())
        : [];
}
exports.exclusions = exclusions;
