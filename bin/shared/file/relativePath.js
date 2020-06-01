"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativePath = void 0;
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
