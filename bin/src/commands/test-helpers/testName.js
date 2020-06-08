"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testName = void 0;
/**
 * Given a test file, return the name of the file without
 * the file extension and any file path that preceeds the file
 */
function testName(testFile, pattern) {
    pattern = pattern.replace("**/*", "");
    const name = testFile
        .split("/")
        .pop()
        .replace(pattern, "");
    return name;
}
exports.testName = testName;
