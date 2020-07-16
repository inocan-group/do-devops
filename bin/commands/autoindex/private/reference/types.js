"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportType = exports.ExportAction = void 0;
var ExportAction;
(function (ExportAction) {
    ExportAction[ExportAction["updated"] = 0] = "updated";
    ExportAction[ExportAction["added"] = 1] = "added";
    ExportAction[ExportAction["noChange"] = 2] = "noChange";
})(ExportAction = exports.ExportAction || (exports.ExportAction = {}));
var ExportType;
(function (ExportType) {
    /** export the default export as the name of the file */
    ExportType["default"] = "default";
    /** export all named exports from files and directories (with another index file) */
    ExportType["named"] = "named";
    /** export all  */
    ExportType["namedOffset"] = "namedOffset";
})(ExportType = exports.ExportType || (exports.ExportType = {}));
