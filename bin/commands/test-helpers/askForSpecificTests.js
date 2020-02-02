"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpecificTestReason;
(function (SpecificTestReason) {
    SpecificTestReason[SpecificTestReason["noResultsFound"] = 0] = "noResultsFound";
    SpecificTestReason[SpecificTestReason["askedFor"] = 1] = "askedFor";
})(SpecificTestReason = exports.SpecificTestReason || (exports.SpecificTestReason = {}));
/** provide interactive help on choosing the right unit tests to run */
function askForSpecificTests(reason, tests) {
    return [];
}
exports.askForSpecificTests = askForSpecificTests;
