"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncate = void 0;
/**
 * Converts an array of _strings/numbers_ into a string representation where
 * there is a _maximum length_ if where exceeded the array is truncated and
 * and elipsis is added instead.
 *
 * @param things a list of strings or numbers
 * @param maxLength the maximum number of items to display
 * @param separater the separater symbol
 */
function truncate(things, maxLength, separater = ", ") {
    things = things.map(i => (typeof i === "string" ? i : String(i)));
    if (things.length > maxLength) {
        things = things.slice(0, maxLength).concat("...");
    }
    return things.join(separater);
}
exports.truncate = truncate;
