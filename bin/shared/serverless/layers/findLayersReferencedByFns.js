"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLayersReferencedByFns = void 0;
const private_1 = require("../../../private");
/**
 * Introspects your current configuration (ts config) and finds all
 * references to AWS Layers
 */
function findLayersReferencedByFns() {
    const fns = private_1.getLambdaFunctions();
}
exports.findLayersReferencedByFns = findLayersReferencedByFns;
