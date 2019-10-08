"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const recast = __importStar(require("recast"));
const types = recast.types.namedTypes;
const builders = recast.types.builders;
/**
 * Given a file, it will look for the `handler` export
 * and return the comments associated with it. Alternatively
 * it will also look for comments associated with the `fn`
 * export.
 */
function findHandlerComments(filename) {
    const ast = index_1.parseFile(filename);
    const fnComments = index_1.namedExports(ast)
        .find(i => i.name === "fn")
        .comments.filter(i => i.leading);
    const handlerComments = index_1.namedExports(ast)
        .find(i => i.name === "handler")
        .comments.filter(i => i.leading);
    return fnComments.length > 0
        ? fnComments
        : handlerComments.length > 0
            ? handlerComments
            : [];
}
exports.findHandlerComments = findHandlerComments;
