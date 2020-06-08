"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripFileExtension = void 0;
/**
 * Given a file or path and file, it strips off the
 * file's extension. Because extensions are typically
 * no longer than 4 characters this is built into the
 * criteria but you can override this default.
 */
function stripFileExtension(filepath, extMaxLength = 4) {
    const re = new RegExp(`(.*)\.[^.]+?$`);
    return filepath.replace(re, "$1");
}
exports.stripFileExtension = stripFileExtension;
