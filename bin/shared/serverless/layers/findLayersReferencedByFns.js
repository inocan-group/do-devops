"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLayersReferencedByFns = void 0;
const shared_1 = require("../../../shared");
/**
 * Introspects your current configuration (ts config) and finds all
 * references to AWS Layers
 */
function findLayersReferencedByFns() {
    const fns = shared_1.getLambdaFunctions();
}
exports.findLayersReferencedByFns = findLayersReferencedByFns;
