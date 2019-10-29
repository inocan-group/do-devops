"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * reduces an absolute path to a relative path to the project root or optionally
 * the project root _offset_ by the `offset` property
 *
 * @param path the absolute path
 * @param offset the optional offset of the project root
 */
function relativePath(path, offset) {
    return path.replace(process.cwd(), "").replace(/^\//, "");
}
exports.relativePath = relativePath;
