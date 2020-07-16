"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAllExtensions = exports.removeExtension = void 0;
function removeExtension(file, force = false) {
    const parts = file.split(".");
    const [fn, ext] = parts.length > 2 ? [file.replace("." + parts[parts.length - 1], ""), parts[parts.length - 1]] : file.split(".");
    return fn;
}
exports.removeExtension = removeExtension;
function removeAllExtensions(files) {
    return files.map((f) => removeExtension(f));
}
exports.removeAllExtensions = removeAllExtensions;
