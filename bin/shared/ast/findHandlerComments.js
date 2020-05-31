"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const recast = require("recast");
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
    const fn = index_1.namedExports(ast).find(i => i.name === "fn");
    const fnComments = fn ? fn.comments.filter(i => i.leading) : [];
    const handler = index_1.namedExports(ast).find(i => i.name === "handler");
    const handlerComments = handler
        ? handler.comments.filter(i => i.leading)
        : [];
    return fnComments.length > 0
        ? fnComments
        : handlerComments.length > 0
            ? handlerComments
            : [];
}
exports.findHandlerComments = findHandlerComments;
